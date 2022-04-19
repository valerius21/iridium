import { Link, useSearchParams } from "@remix-run/react";

const DSGVO = () => {
  const [searchParams] = useSearchParams();

  const ticket = searchParams.get("tic") || "";
  return (
    <>
      <div className="prose prose-lg mx-auto">
        <h1>Datenerhebung und -handhabung</h1>
        <p>
          Diese Studie wird im Rahmen eines Forschungsprojektes der
          Forschungsgruppe „Computersicherheit und Privatheit“ der Universität
          Göttingen, Wilhelmsplatz 1, 37073 Göttingen (vertreten durch den
          Präsidenten, Verantwortlicher i.S.d. Art. 4 Nr. 7 EU-DS-GVO)
          durchgeführt. Ihre Ansprechpartner dazu sind Prof. Dr. Delphine
          Reinhardt, reinhardt@cs.uni-goettingen.de und Lindrit Kqiku,
          kqiku@cs.uni-goettingen.de. Ihre Antworten, die im Rahmen dieser
          Studie erhoben werden, werden anonymisiert und nur im Kontext dieser
          Studie verwendet. Als Erhebungsplattform benutzen wir eine
          Webapplikation, welche auf den GWDG Servern gehostet wird, die die
          Daten in der EU speichern und dadurch der europäischen Regulierung
          folgen. Ihre anonymisierten Antworten werden durch Angestellte der
          Forschungsgruppe analysiert und bewertet. Die Ergebnisse der Studie
          können zu einem späteren Zeitpunkt als wissenschaftliche
          Publikation(en) veröffentlicht werden. Wie durch die DFG empfohlen
          werden Ihre Antworten für eine Periode von 10 Jahre gespeichert, um
          die Einhaltung der Richtlinien der guten wissenschaftlichen Praxis bei
          Anfrage beweisen zu können.
        </p>
        <p>
          Auch wenn Ihre Daten anonym sind, müssen wir Sie aus rechtlichen
          Gründen darüber informieren, dass Ihnen folgende Rechte - soweit sie
          rein logisch in Frage kommen - in Bezug auf Ihre durch uns
          verarbeiteten personenbezogenen Daten zustehen:
        </p>
        <ul>
          <li>
            Recht auf Auskunft der durch uns von Ihnen verarbeiteten
            personenbezogenen Daten
          </li>
          <li>
            In bestimmten Fällen Berichtigung, Löschung, Einschränkung der
            Verarbeitung Ihrer personenbezogenen Daten oder Widerspruch gegen
            die Verarbeitung.
          </li>
        </ul>
        <p>
          Bitte wenden Sie sich dazu an Herrn Lindrit Kqiku. Die Kontaktdaten
          finden Sie untenstehend.
        </p>
        <code>
          Lindrit Kqiku, kqiku@cs.uni-goettingen.de, Tel: +49 551 39-26049
        </code>
        <p>
          Für Fragen zum Thema Datenschutz ist der Datenschutzbeauftragte der
          Universität Göttingen, Herr Prof. Wiebe, wie folgt zu erreichen:
          datenschutz@uni-goettingen.de, Postadresse: Platz der Göttinger Sieben
          6, 37073 Göttingen. Mehr unter
          https://www.uni-goettingen.de/de/576209.html
        </p>
        <p>
          Mit Beschwerden dürfen Sie sich jederzeit auch direkt an die
          Landesbeauftragte für den Datenschutz Niedersachsen, Prinzenstraße 5,
          30159 Hannover, E-Mail: poststelle@lfd.niedersachsen.de, wenden.
        </p>

        <h1>Einverständniserklärung</h1>
        <p>
          Ich habe die vorangehenden Informationen gelesen und zur Kenntnis
          genommen. Hiermit bestätige ich, dass ich volljährig und unbeschränkt
          geschäftsfähig bin und erkläre mich freiwillig damit einverstanden, an
          der oben beschriebenen Studie teilzunehmen. Ich bin damit
          einverstanden, dass die im Rahmen dieser Studie erhobenen Daten und
          Untersuchungsergebnisse wie oben beschrieben und in anonymisierter
          Form zu Forschungszwecken verwendet werden.
        </p>
        <Link to={`/register?tic=${ticket}`}>
          <button className="btn btn-primary btn-block mt-10 max-w-md">
            Zurück
          </button>
        </Link>
      </div>
    </>
  );
};

export default DSGVO;
