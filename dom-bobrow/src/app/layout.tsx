import './globals.css'
import { VisitBeacon } from "./components/VisitBeacon";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}