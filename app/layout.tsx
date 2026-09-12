import type {Metadata} from "next";
import "./globals.css";
export const metadata:Metadata={title:{default:"Stahlé | Mobiliario de diseño",template:"%s | Stahlé"},description:"Muebles de metal, vidrio, madera y piedra diseñados y fabricados en Guatemala.",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
