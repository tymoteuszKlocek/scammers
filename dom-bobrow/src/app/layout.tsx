
import { VisitBeacon } from "./components/VisitBeacon";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <VisitBeacon /> {/* TO MUSI TU BYĆ */}
        {children}
      </body>
    </html>
  )
}