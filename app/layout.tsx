import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./main.scss";
import "./globals.css";
import "./left-fromjekyll.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Header } from "./components/Header";
import { getCategories } from "./utils/categories";
config.autoAddCss = false;

const rubik = Rubik({
  display: "swap",
  subsets: ["latin", "hebrew"],
  weight: ["400", "700"],
  variable: "--font-display",
});

import "./mixpanel";
export const metadata: Metadata = {
  title: "לינק לישראל – פורטל יוזמות - חרבות הברזל!",
  description:
    "אם אתם מחפשים איך לעזור או צריכים עזרה או מידע – זה המקום. לינק לישראל מרכז את כל המשאבים האלה במקום אחד, במטרה שכל אחד ואחת יוכלו למצוא או לתת את הסיוע הנכון עבורם - פרויקט קוד פתוח.",
  viewport: "width=device-width, initial-scale=1",
  appleWebApp: {
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    url: "https://www.linksforisrael.com",
    images:
      "https://res.cloudinary.com/dargbitr2/image/upload/v1697311977/LinksForIsrael/jix5eizmqcegmfra89gs.jpg",
    type: "website",
  },
  icons: {
    icon: "https://res.cloudinary.com/dargbitr2/image/upload/v1697228919/LinksForIsrael/r5ysb355egkpyd10jovq.jpg",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <html lang="he" className={rubik.variable}>
      {/* "{{ page.lang | default: site.lang | default: 'he' }}" */}
      <head></head>
      <body dir="rtl">
        {/* {{ page.direction }} */}
        <Header categories={JSON.parse(JSON.stringify(categories))} />

        <div className="main-subtitle" id="first-subtitle">
          הולכים לאיבוד בין כל היוזמות השונות שהוקמו?
        </div>
        <div className="main-subtitle">כל אתרי הסיוע למלחמה במקום אחד 🇮🇱</div>

        <main id="content" className="main-content" role="main">
          {children}

          <footer className="site-footer">
            <div className="invite-text">הצטרפו אלינו והראו לנו תמיכה</div>
            <div className="social-links">
              <a
                href="https://www.instagram.com/links_for_israel/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1200px-Instagram_icon.png"
                  alt="Instagram"
                  width="32"
                  height="32"
                />
              </a>
              <a
                href="https://www.facebook.com/LinksForIsrael/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/1024px-2021_Facebook_icon.svg.png?20220821121039"
                  alt="Facebook"
                  width="32"
                  height="32"
                />
              </a>
              <a
                href="https://github.com/4tals/LinksForIsrael/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                  alt="GitHub"
                  width="32"
                  height="32"
                />
              </a>
            </div>
            <div className="quote-link flex flex-col items-center justify-center">
              <a
                href="https://twitter.com/kann/status/1712897481837539810?t=kxXrXgX59tp1yPnrYiS4Iw&s=19"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://user-images.githubusercontent.com/8555641/275328060-dc897827-8b49-459e-b9d0-bf46aac57f98.png"
                  alt="Initiative Icon"
                  className="footer-icon"
                  width="100"
                />
              </a>
              <div className="invite-text">
                &quot;הופכים עליהם, טובים אותם&quot;
              </div>
            </div>
          </footer>
        </main>

        <footer className="add-site-footer">
          <a
            className="add-site-button"
            href="#"
            // onclick="toggleForm(); return false;"
          >
            הוסיפו יוזמה +
          </a>
          <div className="add-site-form">
            <div
              className="form-container-backdrop"
              // onclick="toggleForm(); return false"
            ></div>
            <div className="form-container">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSeZsW9WkleVF7-9Wtx6JKWTw9cInqJEpMocR54tZkwjAXPxRg/viewform?embedded=true"
                width="300"
                height="520"
                frameBorder={0}
                marginHeight={0}
                marginWidth={0}
              >
                Loading…
              </iframe>
              <a
                className="close-form-button"
                href="#"
                // onclick="toggleForm(); return false;"
              >
                סגור את הטופס
              </a>
              <div
                className="close-form-x-button"
                // onclick="toggleForm(); return false;"
              >
                ✕
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
