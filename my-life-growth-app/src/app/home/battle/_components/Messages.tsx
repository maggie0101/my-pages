type MessagesProp = {
  message: string;
};
export default function Messages({ message }: MessagesProp) {
  return <div>{message}</div>;
}
