export default function Banner({ message }: { message: string }) {
  return (
    <div className="h-64 flex justify-center items-center">
      <p>{message}</p>
    </div>
  );
}
