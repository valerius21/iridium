import { Link, useSearchParams } from "@remix-run/react";
import FormError from "~/components/form/FormError";

const Logo = () => (
  <img src={`/csp_logo.jpg`} alt="CSP LOGO" className="mx-auto max-h-64" />
);

const Home = () => {
  const [searchParams] = useSearchParams();
  const ticket = searchParams.get("tic") || "";
  return (
    <>
      <div className="prose mx-auto">
        <h1>Studie zur Privatsphäre-bewussten Bildklassifizierung</h1>
        <Logo />
        <h2>Studieninformationen</h2>

        <section>
          <p className="prose prose-xl prose-stone">
            Sehr geehrte Damen und Herren, Ziel dieser Studie ist es, das
            Teilungsverhalten der Nutzer zu verstehen, indem sie gebeten werden,
            eine Reihe von Bildern entsprechend ihrer Wahrnehmung der
            Privatsphäre zu annotieren. Die Nutzer werden gebeten, eine Reihe
            von Bildern (1) nach ihrer Empfindlichkeit zu bewerten, d. h. auf
            einer 4- Likert-Skala und (2) die Zielgruppe anzugeben, mit der sie
            ein bestimmtes Bild teilen würden , wenn sie hypothetisch diejenigen
            wären, die die Bilder aufgenommen haben und in der Lage wären, diese
            Bilder zu teilen (d. h. mit niemandem, Familie, Freunden, Bekannten,
            Kollegen oder allen).
          </p>
          <p className="prose prose-xl prose-stone">
            Zu diesem Zweck haben wir eine Web-Applikation entworfen und
            implementiert, die einen öffentlich zugänglichen Flickr-Datensatz
            mit Bildern verwendet, um die Meinungen der Nutzer zu sammeln.
            Sowohl die Front-End Web-Applikation als auch die zugehörige
            Back-End-Datenbank werden in unserer Universitätsinfrastruktur (d.
            h. auf den Servern der GWDG) gehostet und gespeichert. Alle
            Antworten sind anonym. Wir speichern einen generierten
            Zugangsschlüssel unter Verwendung von Session-Cookies, eine
            Bildkennung und ihre Antworten zu den oben genannten Fragen. Darüber
            hinaus haben wir zur Ergänzung der Studie innerhalb der
            Web-Applikation eine Umfrage mit 32 Fragen entworfen, um das
            Sharing-Verhalten im Hinblick auf die Demographie der Nutzer, die
            Nutzung sozialer Medien und ihre Bedenken bezüglich der Privatsphäre
            zu verstehen.
	    Letztlich wird nur der Datensatz, der aus gelabelten Bildern und den entsprechenden anonymisierten Benutzerkennungen besteht, als Open Source öffentlich zugänglich sein.
          </p>
          <p className="prose prose-xl prose-stone">
            Das Endziel unserer Studie ist es, die annotierten Bilder zu
            verwenden, um Deep-Learning- Klassifizierungsmodelle zu entwerfen
            und zu implementieren, die den Nutzern helfen, ihre Privatsphäre zu
            verbessern, indem sie ihnen die Empfindlichkeit eines Bildes, das
            geteilt werden soll, und die Zielgruppe vorschlagen.
          </p>
          <p className="prose prose-xl prose-stone">
            Die geplante Dauer der Studie beträgt ca. 60 Minuten. Die Studie
            beschränkt sich auf volljährige Teilnehmer*innen mit unbeschränkter
            Geschäftsfähigkeit.
          </p>
          <p className="prose prose-xl prose-stone">
            Bitte nehmen Sie zur Kenntnis, dass Sie während keiner der Schritte
            dieser Studie einen Fehler machen können. Es gibt keine richtigen
            oder falschen Antworten. Die Teilnahme an dieser Studie geschieht
            auf ausschließlich freiwilliger Basis und Sie können Ihre Teilnahme
            an der Studie ohne Angabe von Gründen jederzeit abbrechen. Ihre
            Daten werden dann unverzüglich gelöscht, obwohl die
            Datenverarbeitung bis zu diesem Zeitpunkt rechtmäßig bleibt. Bitte
            beachten Sie auch das Hinweisblatt zu Art. 13 DSGVO.
          </p>
        </section>
      </div>
      <div className="container mx-auto max-w-md">
        {!ticket && <FormError error={"Ticket nicht gefunden"} />}

        <Link to={`/register?tic=${ticket}`}>
          <button
            id="start"
            className="btn btn-primary btn-xl mr-10 w-full"
            disabled={ticket.length < 1}
          >
            {"Starten"}
          </button>
        </Link>
      </div>
    </>
  );
};

export default Home;
