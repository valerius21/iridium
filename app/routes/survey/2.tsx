import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { getUserId } from "~/utils/session.server";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import RadioField from "~/components/form/survey/RadioField";
import CheckBoxField from "~/components/form/survey/CheckBoxField";
import { makeDomainFunction, inputFromForm } from "remix-domains";
import { formAction } from "remix-forms";
import { checkbox, radio } from "~/utils/validators";
import { logger } from "~/utils/logger.server";
import { prisma } from "~/db.server";

const schema = z.object({
  uid: z.string(),
  social_networks: checkbox,
  social_media_frequency: radio,
  social_networks_most_used_to_share_photos: checkbox,
  usual_demographic_groups: checkbox,
  photo_sharing_frequency: radio,
  photo_sharing_frequency_with_family_friends: radio,
  photo_sharing_frequency_with_other_people: radio,
  internet_usage_frequency_on_a_computer: radio,
  internet_usage_frequency_on_mobile: radio,
});

const TAG = "[survey/2] ";

export const mutation = makeDomainFunction(schema)(async (values) => {
  logger.info(values, TAG + "mutation");
  const {
    internet_usage_frequency_on_a_computer,
    internet_usage_frequency_on_mobile,
    photo_sharing_frequency,
    photo_sharing_frequency_with_family_friends,
    photo_sharing_frequency_with_other_people,
    social_media_frequency,
    social_networks,
    social_networks_most_used_to_share_photos,
    usual_demographic_groups,
    uid,
  } = values;

  const exists = await prisma.surveyTwo.count({
    where: {
      userId: uid,
    },
  });

  if (exists > 0) {
    logger.info(TAG + "mutation: survey already exists");
    return;
  }

  await prisma.surveyTwo.create({
    data: {
      internet_usage_frequency_on_a_computer:
        internet_usage_frequency_on_a_computer[0],
      internet_usage_frequency_on_mobile: internet_usage_frequency_on_mobile[0],
      photo_sharing_frequency: photo_sharing_frequency[0],
      photo_sharing_frequency_with_family_friends:
        photo_sharing_frequency_with_family_friends[0],
      photo_sharing_frequency_with_other_people:
        photo_sharing_frequency_with_other_people[0],
      social_media_frequency: social_media_frequency[0],
      // checkboxes
      social_networks,
      social_networks_most_used_to_share_photos,
      usual_demographic_groups,
      // uid
      userId: uid,
    },
  });
});

export const action: ActionFunction = async ({ request }) => {
  const result = await mutation(await inputFromForm(request));

  logger.info(result, TAG + "action");
  return formAction({ request, schema, mutation, successPath: "/survey/3" });
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserId(request);
  return { user };
};

const SocialMediaUsage = () => {
  const { user } = useLoaderData<{ user: string }>();
  let questionNo = 4;
  return (
    <>
      <h2>Social Media Nutzung</h2>
      <ValidatedForm
        method="post"
        action="/survey/2"
        validator={withZod(schema)}
      >
        <input type="hidden" name="uid" value={user} />

        <CheckBoxField
          title={`${questionNo++}.) Bei welchen sozialen Netzwerken haben Sie ein Nutzerkonto? (Wählen Sie alle zutreffenden aus.)`}
          name="social_networks"
          options={[
            "Facebook",
            "Instagram",
            "Pinterest",
            "Snapchat",
            "Twitter",
            "Flickr",
            "Reddit",
          ]}
          otherField={true}
        />

        <RadioField
          title={`${questionNo++}.) Wie regelmäßig sind Sie in den sozialen Medien unterwegs?`}
          name="social_media_frequency"
          options={[
            "Nie",
            "Weniger als einmal im Monat",
            "Einmal im Monat",
            "Mehrmals im Monat",
            "Einmal in der Woche",
            "Mehrmals in der Woche",
            "Einmal am Tag",
            "Mehrmals am Tag",
          ]}
        />
        <CheckBoxField
          title={`${questionNo++}.) Welchen sozialen Netzwerke nutzen Sie am häufigsten, um Fotos online zu teilen?`}
          name="social_networks_most_used_to_share_photos"
          options={[
            "Facebook",
            "Instagram",
            "Pinterest",
            "Snapchat",
            "Twitter",
            "Flickr",
            "Reddit",
          ]}
          otherField={true}
        />
        <CheckBoxField
          title={`${questionNo++}.) Wenn Sie Fotos online teilen, mit wem teilen Sie sie normalerweise?`}
          name="usual_demographic_groups"
          options={[
            "Familie",
            "Freunde",
            "Bekannte",
            "Arbeit/Kollegen",
            "Alle",
            "Es kommt darauf an",
            "Ich weiß es nicht",
          ]}
        />
        <RadioField
          title={`${questionNo++}.) Wie häufig teilen Sie Fotos in sozialen Netzwerken?`}
          name="photo_sharing_frequency"
          options={[
            "Nie",
            "Weniger als einmal im Monat",
            "Einmal im Monat",
            "Mehrmals im Monat",
            "Einmal in der Woche",
            "Mehrmals in der Woche",
            "Einmal am Tag",
            "Mehrmals am Tag",
          ]}
        />
        <RadioField
          title={`${questionNo++}.) Wie häufig teilen Sie Bilder über soziale Netzwerke, die von Ihnen, Ihren Freunden oder Ihrer Familie aufgenommen wurden?`}
          name="photo_sharing_frequency_with_family_friends"
          options={[
            "Nie",
            "Weniger als einmal im Monat",
            "Einmal im Monat",
            "Mehrmals im Monat",
            "Einmal in der Woche",
            "Mehrmals in der Woche",
            "Einmal am Tag",
            "Mehrmals am Tag",
          ]}
        />
        <RadioField
          title={`${questionNo++}.) Wie häufig teilen Sie Bilder über soziale Netzwerke, die Sie im Internet gefunden haben oder von anderen Personen (als Ihre Freunde, Familie oder anderer Personen, die Sie persönlich kennen.) aufgenommen wurden?`}
          name="photo_sharing_frequency_with_other_people"
          options={[
            "Nie",
            "Weniger als einmal im Monat",
            "Einmal im Monat",
            "Mehrmals im Monat",
            "Einmal in der Woche",
            "Mehrmals in der Woche",
            "Einmal am Tag",
            "Mehrmals am Tag",
          ]}
        />
        <RadioField
          title={`${questionNo++}.) Wie häufig nutzen Sie das Internet über einen Computer?`}
          name="internet_usage_frequency_on_a_computer"
          options={[
            "Die meiste Zeit des Tages",
            "Mehrmals am Tag",
            "Etwa einmal am Tag",
            "Ein paar Mal pro Woche",
            "Ein paar Mal im Monat",
            "Ein paar Mal im Jahr",
            "Nie",
            "Ich möchte lieber nicht antworten",
          ]}
        />

        <RadioField
          title={`${questionNo}.) Wie häufig benutzen Sie mobile Geräte wie ein Smartphone oder ein Tablet?`}
          name="internet_usage_frequency_on_mobile"
          options={[
            "Die meiste Zeit des Tages",
            "Mehrmals am Tag",
            "Etwa einmal am Tag",
            "Ein paar Mal pro Woche",
            "Ein paar Mal im Monat",
            "Ein paar Mal im Jahr",
            "Nie",
            "Ich möchte lieber nicht antworten",
          ]}
        />
        <button className="btn btn-primary my-5">Weiter</button>
      </ValidatedForm>
    </>
  );
};

export default SocialMediaUsage;
