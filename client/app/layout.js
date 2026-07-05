import "./globals.css";

export const metadata = {
  title: "FreelanceDesk",
  description: "Manage your freelance projects and deliverables",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
