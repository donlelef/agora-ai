export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Agora AI</h1>
        <p className="text-gray-600">
          Simulate and optimize your social media posts
        </p>
      </div>
      {children}
    </div>
  );
}

