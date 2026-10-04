import type { StructureResolver } from "sanity/structure";

/** Desk layout tuned for non-developer leads: grouped by the job they're doing. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("TechnoJam")
    .items([
      S.listItem().title("Site settings").id("siteSettings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.documentTypeListItem("socialLink").title("Social links"),
      S.divider(),
      S.documentTypeListItem("homepageFeature").title("Homepage features"),
      S.documentTypeListItem("announcement").title("Announcements"),
      S.divider(),
      S.documentTypeListItem("recruitmentCycle").title("Recruitment"),
      S.documentTypeListItem("event").title("Events"),
      S.documentTypeListItem("dexterixEdition").title("Dexterix editions"),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("domain").title("Domains"),
      S.divider(),
      S.listItem()
        .title("People")
        .child(
          S.list()
            .title("People")
            .items([
              S.listItem()
                .title("Current members")
                .child(S.documentList().title("Current members").filter('_type == "person" && currentMember == true')),
              S.listItem().title("Alumni").child(S.documentList().title("Alumni").filter('_type == "person" && currentMember != true')),
              S.documentTypeListItem("teamYear").title("Team years"),
            ]),
        ),
      S.documentTypeListItem("milestone").title("History"),
      S.documentTypeListItem("metric").title("Impact metrics"),
      S.documentTypeListItem("achievement").title("Achievements"),
      S.documentTypeListItem("gallery").title("Galleries"),
      S.divider(),
      S.documentTypeListItem("sponsor").title("Sponsors"),
      S.documentTypeListItem("partner").title("Partners"),
      S.documentTypeListItem("resource").title("Resources"),
      S.divider(),
      S.documentTypeListItem("inquiry").title("Collaboration inquiries"),
      S.listItem()
        .title("Needs verification")
        .child(
          S.documentList()
            .title("Pending verification")
            .filter('verification.status == "pending" || participantsActual.verification.status == "pending"'),
        ),
    ]);
