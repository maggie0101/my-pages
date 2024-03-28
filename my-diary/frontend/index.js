
/* global axios */
const addButton = document.querySelector("#add-button");
const mainArea = document.querySelector("#main-area");

const moods = ["開心", "快樂", "生氣","難過","驚訝","疲累","痛苦"];
const types=["學業","社團","健康","家人","人際"];
const daysOfWeek = ["(日)", "(一)", "(二)", "(三)", "(四)", "(五)", "(六)"];

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

const filter = document.querySelector("#filter");
const filter_types = moods.concat(types); // 将两个数组合并
filter_types.forEach((tag) => {
  const filterOption = document.createElement("option");
  filterOption.value = tag;
  filterOption.text = tag;
  filter.appendChild(filterOption);
});

async function main() {
  mainArea.innerHTML = ""
  try {

    const diaries = await getDiaries();
    diaries.forEach((diary) => renderDiary(diary));
  } catch (error) {
    alert("Failed to load diaries!");
  }
  
  filter.addEventListener("change", async() => {
    checkFilter(filter.value);
    });

  addButton.onclick = async () => {
    mainArea.innerHTML = "";
    
    //心情
    const moodSelect = document.createElement("select");
    moodSelect.setAttribute("type", "text");
    moodSelect.setAttribute("class","moodSelect");
    
    
    moods.forEach((mood) => {
      const moodOption = document.createElement("option");
      moodOption.value = mood;
      moodOption.text = mood;
      moodSelect.appendChild(moodOption);
    })
    mainArea.appendChild(moodSelect);
    //種類
    const typeSelect = document.createElement("select");
    typeSelect.setAttribute("class","typeSelect");
    typeSelect.setAttribute("type","text");
    
    
    types.forEach((type) =>{
      const typeOption = document.createElement("option");
      typeOption.value = type;
      typeOption.text = type;
      typeSelect.appendChild(typeOption);
    })
    mainArea.appendChild(typeSelect);
    //日期
    const dateInput = document.createElement("input"); //使用者以何種形式操作
    dateInput.setAttribute("type","date");
    dateInput.setAttribute("class", "dateInput"); //何種形式顯示

    const dateDisplay = document.createElement("text"); // 用于显示日期和星期几
    dateDisplay.setAttribute("class", "dateDisplay");

    dateInput.addEventListener("change", function() {
      // 获取用户选择的日期
      const selectedDate = new Date(dateInput.value);
      
      const modifiedDate = dateInput.value.replace(/-/g, '.'); // 使用正则表达式替换所有短划线
      // 获取星期几的数字，其中0代表星期日，1代表星期一，依此类推
      const dayOfWeek = selectedDate.getDay();
      
      // 将数字转换为星期几的文本
      
      const selectedDayOfWeek = daysOfWeek[dayOfWeek];
      
      const formattedDate = `${modifiedDate} ${selectedDayOfWeek}`;
      dateDisplay.textContent = formattedDate;
      
      //dateDisplay.hidden = true;
    
    });
    mainArea.appendChild(dateInput);
    mainArea.appendChild(dateDisplay);
  

    //敘述
    const descriptionInput = document.createElement("textarea");
    descriptionInput.setAttribute("type","text");
    descriptionInput.setAttribute("class", "descriptionInput");
    mainArea.appendChild(descriptionInput);

    
    //儲存按鈕
    const saveButton = document.createElement("button");
    //saveButton.setAttribute("type","button");
    saveButton.setAttribute("id","saveButton");
    saveButton.textContent = "儲存";
    saveButton.onclick = async () => {

      const moodContent = moodSelect.value;
      const typeContent = typeSelect.value;
      const dateContent = dateDisplay.textContent;
      const descriptionContent = descriptionInput.value;
      try{
        if (!dateContent) {
          alert("Please enter a diary date!");
          return;
        }
        if (!descriptionContent) {
          alert("Please enter a diary description!");
          return;
        }
        await createDiary({
          mood: moodContent,
          type: typeContent,
          date: dateContent,
          description: descriptionContent});
        
        const diaries = await getDiaries();
        mainArea.innerHTML = "";
        diaries.forEach((diary) => renderDiary(diary));

      }catch(error){
        alert("Failed to create a diary!");
        return;
      }

    }
    mainArea.appendChild(saveButton);

    //取消按鈕
    const cancelButton = document.createElement("button");
    cancelButton.setAttribute("id","cancelButton");
    cancelButton.textContent = "取消";
    mainArea.appendChild(cancelButton);

    cancelButton.onclick = async() => {
      const diaries = await getDiaries();
      mainArea.innerHTML = "";
      diaries.forEach((diary) => renderDiary(diary));
      filter.value = "請選擇篩選類別";
    }
  
  
  }

}

async function checkFilter(value){
  try{

    mainArea.innerHTML = "";
    if(value === "請選擇篩選類別"){
      const diaries = await getDiaries();
      diaries.forEach((diary) => renderDiary(diary));

    }else{
      mainArea.innerHTML = "";
      const diaries = await getDiaries();
      diaries.forEach((diary) => {
        if(diary.mood === value||diary.type === value){
          renderDiary(diary);
        
        }
      })
    }
    
    
    // 监听下拉菜单的变化事件

  }catch(error){
    alert("Failed to select diaries");
    return;
  }

}



function createDiaryCard(diary) {
  const diaryCard = document.createElement("div");
  diaryCard.classList.add("diary-card");
  const moodElement = document.createElement("p");
  moodElement.textContent = diary.mood;
  moodElement.className = "mood";

  const typeElement = document.createElement("p");
  typeElement.textContent = diary.type;
  typeElement.className = "type";

  const dateElement = document.createElement("p");
  dateElement.textContent = diary.date;

  dateElement.className = "date";

  const descriptionElement = document.createElement("p");
  descriptionElement.textContent = diary.description;
  descriptionElement.className = "description";


  // 将子元素添加到日记卡中
  diaryCard.appendChild(moodElement);
  diaryCard.appendChild(typeElement);
  diaryCard.appendChild(dateElement);
  diaryCard.appendChild(descriptionElement);

  diaryCard.onclick = async() => {
    loadDiaryPage(diary.id);
  }

  return diaryCard;
  

}

async function loadDiaryPage(id){
  const diaries = await getDiaries();
  mainArea.innerHTML = "";
  diaries.forEach(diary => {
    if (id == diary.id){
      checkDiaryPage(diary);
    }
  });
  

}

function checkDiaryPage(diary){
  const diaryPage = document.createElement("div");
  diaryPage.classList.add("diary-element"); 
  const moodPage = document.createElement("p");
  moodPage.textContent = diary.mood;
  diaryPage.appendChild(moodPage);

  const typePage = document.createElement("p");
  typePage.textContent = diary.type;
  diaryPage.appendChild(typePage);

  const datePage = document.createElement("p");
  datePage.textContent = diary.date;
  diaryPage.appendChild(datePage); 

  const descriptionPage = document.createElement("p");
  descriptionPage.textContent=diary.description;
  diaryPage.appendChild(descriptionPage);

  const editButton = document.createElement("button");
  editButton.textContent = "編輯";
  editButton.classList.add("diary-page-button");
  diaryPage.appendChild(editButton);

  editButton.onclick = async() => {
    editPage(diary);
  }

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "回首頁";
  cancelButton.classList.add("diary-page-button");
  diaryPage.appendChild(cancelButton);

  cancelButton.onclick = async() => {
    const diaries = await getDiaries();
    mainArea.innerHTML = "";
    diaries.forEach((diary) => renderDiary(diary));
    filter.value = "請選擇篩選類別";

  }

  mainArea.appendChild(diaryPage);



}


function editPage(diary){
  mainArea.innerHTML = "";
  const moodSelect = document.createElement("select");
  moodSelect.setAttribute("class","moodSelect");
  moods.forEach((mood) => {
    const moodOption = document.createElement("option");
    moodOption.value = mood;
    moodOption.text = mood;
    moodSelect.appendChild(moodOption);
  })
  moodSelect.value = diary.mood;

  const typeSelect = document.createElement("select");
  typeSelect.setAttribute("class","typeSelect");
  types.forEach((type) =>{
    const typeOption = document.createElement("option");
    typeOption.value = type;
    typeOption.text = type;
    typeSelect.appendChild(typeOption);
  })
  typeSelect.value = diary.type;

  const dateInput = document.createElement("input");
  dateInput.setAttribute("class","dateInput");
  dateInput.setAttribute("type","date");
  

  const datePattern = /\d{4}.\d{2}.\d{2}/;  // 日期的正则表达式
  const extractedDate = diary.date.match(datePattern)[0];
  const modifiedDate = extractedDate.replace(/\./g, '-');

  
  
  
  //dateInput.value = modifiedDate; // 设置日期输入框的值为提取的日期
  dateInput.textContent = modifiedDate;
  dateInput.value = dateInput.textContent;


  const day = getDiaryDay(dateInput);
  //day.hidden = true;
  


  const descriptionInput = document.createElement("textarea");
  descriptionInput.setAttribute("type","text");
  descriptionInput.setAttribute("class", "descriptionInput");
  descriptionInput.value = diary.description;
  
  

  const saveButton = document.createElement("button");
  saveButton.textContent = "儲存";
  saveButton.classList.add("diary-page-button");
  saveButton.onclick = async() => {
    try{
      
      //const day = getDiaryDay(dateInput);

      if (!dateInput.value) {
        alert("Please enter a diary date!");
        return;
      }
      if (!descriptionInput.value) {
        alert("Please enter a diary description!");
        return;
      }
      await updateDiary(diary.id, {
        mood: moodSelect.value,
        type: typeSelect.value,
        date: day.value,
        description: descriptionInput.value});
      
      const diaries = await getDiaries();
      mainArea.innerHTML = "";
      diaries.forEach((diary) => renderDiary(diary));

    }catch(error){
      alert("Failed to edit a diary!");
      return;
    }

  }

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "刪除";
  deleteButton.classList.add("diary-page-button");
  deleteButton.onclick = async() => {
    await deleteDiaryById(diary.id);
    const diaries = await getDiaries();
    mainArea.innerHTML = "";
    diaries.forEach((diary) => renderDiary(diary));


  }

  

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "取消";
  cancelButton.classList.add("diary-page-button");
  cancelButton.onclick = async() => {
    const diaries = await getDiaries();
    mainArea.innerHTML = "";
    diaries.forEach((diary) => renderDiary(diary));
    filter.value = "請選擇篩選類別";
  }

  mainArea.appendChild(moodSelect);
  mainArea.appendChild(typeSelect);
  mainArea.appendChild(dateInput);
  //mainArea.appendChild(day);
  mainArea.appendChild(descriptionInput);
  mainArea.appendChild(cancelButton);
  mainArea.appendChild(deleteButton);
  mainArea.appendChild(saveButton);
  

}

function getDiaryDay(dateInput) {
  try {
    
    const dateDisplay = document.createElement("text"); // 用于显示日期和星期几
    dateDisplay.setAttribute("class", "dateDisplay");

    const selectedDate = new Date(dateInput.textContent);

    const modifiedDate = dateInput.textContent.replace(/-/g, '.'); // 使用正则表达式替换所有短划线
   
    // 获取星期几的数字，其中0代表星期日，1代表星期一，依此类推
    const dayOfWeek = selectedDate.getDay();

    // 将数字转换为星期几的文本
    
    const selectedDayOfWeek = daysOfWeek[dayOfWeek];
    const formattedDate = `${modifiedDate} ${selectedDayOfWeek}`;
    
    // 更新日期显示文本
    dateDisplay.value = formattedDate
    dateDisplay.textContent = formattedDate;
    


    // 添加日期输入框的 change 事件监听器
    dateInput.addEventListener("change", function () {
      // 获取用户选择的日期

      const selectedDate = new Date(dateInput.value);
      
      const modifiedDate = dateInput.value.replace(/-/g, '.'); // 使用正则表达式替换所有短划线
      // 获取星期几的数字，其中0代表星期日，1代表星期一，依此类推
      const dayOfWeek = selectedDate.getDay();

      // 将数字转换为星期几的文本
    
      const selectedDayOfWeek = daysOfWeek[dayOfWeek];
      const formattedDate = `${modifiedDate} ${selectedDayOfWeek}`;

      // 更新日期显示文本
      dateDisplay.value = formattedDate
      dateDisplay.textContent = formattedDate;
      

    });
   
    mainArea.appendChild(dateDisplay);
    // 将 dateDisplay 添加到页面中
    
    // 返回 dateDisplay 元素
    return dateDisplay;
  } catch (error) {
    console.error("Error in getDiaryDay:", error);
    return dateInput.value; // 如果出现错误，返回 dateInput
  }
}
  

function renderDiary(diary){
  const saveDiary = createDiaryCard(diary);
  mainArea.appendChild(saveDiary);
  
}

async function createDiary(diary) {
  const response = await instance.post("/diaries", diary);
  return response.data;
}

async function getDiaries() {
  const response = await instance.get("/diaries");
  return response.data;
}

async function updateDiary(id, diary) {
  const response = await instance.put(`/diaries/${id}`, diary);
  return response.data;
}

async function deleteDiaryById(id) {
  const response = await instance.delete(`/diaries/${id}`);
  return response.data;
}




main();

