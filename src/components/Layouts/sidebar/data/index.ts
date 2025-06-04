import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "eCommerce",
            url: "/",
            icon: Icons.HomeIcon,
          },
        ],
      },
      {
        title: "Users",
        url: "/users",
        icon: Icons.UsersIcon,
        // items: [
        //   {
        //     title: "Tables",
        //     url: "/tables",
        //   },
        // ],
        items: [],
      },
      {
        title: "Forums",
        url: "/forums",
        icon: Icons.ForumIcon,
        items: [],
      },
      {
        title: "Materials",
        url: "/materials",
        icon: Icons.MaterialsIcon,
        items: [
          {
            title: "Textbook",
            url: "/materials/form-textbook",
            icon: Icons.TextbookIcon,
          },
          {
            title: "Notes",
            url: "/materials/form-notes",
            icon: Icons.NotesIcon,

          },
          {
            title: "Past Year Question",
            url: "/materials/form-pastYear",
            icon: Icons.PastYearIcon,

          },
        ],
      },  
      {
        title: "Study Sessions",
        url: "/studySessions",
        icon: Icons.StudySessionIcon,
        items: [],
      },
      {
        title: "Flashcards",
        url: "/flashcard",
        icon: Icons.FlashcardIcon,
        items: [],
      },      
      // {
      //   title: "Calendar",
      //   url: "/calendar",
      //   icon: Icons.Calendar,
      //   items: [],
      // },
      {
        title: "Profile",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },
      // {
      //   title: "Forms",
      //   icon: Icons.Alphabet,
      //   items: [
      //     {
      //       title: "Form Elements",
      //       url: "/forms/form-elements",
      //       icon: Icons.Alphabet,
      //     },
      //     {
      //       title: "Form Layout",
      //       url: "/forms/form-layout",
      //       icon: Icons.Alphabet,
      //     },
      //   ],
      // },
      // {
      //   title: "Pages",
      //   icon: Icons.Alphabet,
      //   items: [
      //     {
      //       title: "Settings",
      //       url: "/pages/settings",
      //       icon: Icons.Alphabet,
      //     },
      //   ],
      // },
    ],
  },
  // {
  //   label: "OTHERS",
  //   items: [
  //     {
  //       title: "Charts",
  //       icon: Icons.PieChart,
  //       items: [
  //         {
  //           title: "Basic Chart",
  //           url: "/charts/basic-chart",
  //         },
  //       ],
  //     },
  //     {
  //       title: "UI Elements",
  //       icon: Icons.FourCircle,
  //       items: [
  //         {
  //           title: "Alerts",
  //           url: "/ui-elements/alerts",
  //         },
  //         {
  //           title: "Buttons",
  //           url: "/ui-elements/buttons",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Authentication",
  //       icon: Icons.Authentication,
  //       items: [
  //         {
  //           title: "Sign In",
  //           url: "/auth/sign-in",
  //         },
  //       ],
  //     },
  //   ],
  // },
];
