export default function LoadingScreen() {
  return (
    <div className="h-screen flex justify-center items-center">
      <img
        // text-transparent is used to prevent the image alt text from being displayed when firefox
        // tries to load the image
        className="animate-pulse h-64 w-64 text-transparent"
        alt="Alkan Teknoloji logosu"
        src="logo.png"
      />
    </div>
  );
}
