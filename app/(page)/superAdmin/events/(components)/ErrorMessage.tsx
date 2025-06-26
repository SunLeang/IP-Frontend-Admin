export default function ErrorMessage({ message = "Something went wrong." }) {
  return <div className="p-4 text-center text-red-500">{message}</div>;
}
