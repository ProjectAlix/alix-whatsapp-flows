const enhamPayrollQuizConfig = {
  2: {
    2: {
      responseContent: "What is your name?",
      responseType: "text",
      templateKey: null,
      question: "1",
    },
    3: {
      responseContent:
        "If you are completing the training on behalf of your client, please state your name here. If not applicable respond with 'n/a'",
      responseType: "text",
      templateKey: null,
      question: "2",
    },
    4: {
      responseContent: "What is your email address?",
      responseType: "text",
      templateKey: null,
      question: "3",
    },
    5: {
      responseContent: {
        templateVariables:
          "Do you understand that you are receiving a Direct Payment to pay for your Care/Support?\n\nYou can find more information on direct payments here\n\nhttps://www.enhamtrust.org.uk/Pages/Category/direct-payments",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "4",
    },
    6: {
      responseContent: {
        templateVariables:
          "Do you understand that you are receiving a Direct Payment to Choose Your Own Provider?",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "5",
    },
    7: {
      responseContent: {
        templateVariables:
          "Do you know that SCC are not liable for the service providers you choose?",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "6",
    },
    8: {
      responseContent: {
        templateVariables:
          "If/When you choose to become an Employer, do you understand you may have to pay HMRC and purchase Employers Liability Insurance",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "7",
    },
    9: {
      responseContent: {
        templateVariables:
          "Do you understand you will be contacted by the Finance and Benefits Assessment Team?",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "8",
    },
    10: {
      responseContent: {
        templateVariables:
          "Do you know you need a separate bank account for Direct Payments unless you have an Enham Holding Account?",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "9",
    },
    11: {
      responseContent: {
        templateVariables: "You have read Direct Payment policy and guidance",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "10",
    },
    13: {
      responseContent: {
        templateVariables:
          "You fully understand your responsibilities as a Direct Payment recipient",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "11",
    },
    14: {
      responseContent: {
        templateVariables:
          "You understand Client contribution and personal top up",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "12",
    },
    15: {
      responseContent: {
        templateVariables:
          "You know to contact the Local Authority if circumstances change",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "13",
    },
    16: {
      responseContent: {
        templateVariables: "You know what records you have to keep for audits",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "14",
    },
    17: {
      responseContent: {
        templateVariables:
          "The bank account you will use is just for Direct Payments",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "15",
    },
    18: {
      responseContent: {
        templateVariables:
          "You understand that if you do not complete the paperwork you will not receive your Direct Payment funding",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "16",
    },
    19: {
      responseType: "template", //change to template with "ok"
      responseContent: {
        templateVariables:
          "Thank you for watching the videos and answering the questions. Now it is time for the final set of questions.",
      },
      templateKey: "default_ok",
    },
    20: {
      responseType: "text",
      responseContent: "Client Name",
      templateKey: null,
      question: "17",
    },
    21: {
      responseType: "text",
      responseContent: "Representative Name",
      templateKey: null,
      question: "18",
    },
    22: {
      responseType: "text",
      responseContent: "Email Address of Attendee",
      templateKey: null,
      question: "19",
    },
    23: {
      responseContent: {
        templateVariables:
          "You understand you are receiving a Direct Payment to pay for your Care/Support",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "20",
    },
    24: {
      responseContent: {
        templateVariables:
          "You understand that you are receiving a Direct Payment to Choose Your Own Provider",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "21",
    },
    25: {
      responseContent: {
        templateVariables:
          "You know that SCC are not liable for the service providers you choose",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "22",
    },
    26: {
      responseContent: {
        templateVariables:
          "If/When you choose to become an Employer, you may have to pay HMRC and purchase Employers Liability Insurance",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "23",
    },
    27: {
      responseContent: {
        templateVariables:
          "You know you will be contacted by the Finance and Benefits Assessment Team",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "24",
    },
    28: {
      responseContent: {
        templateVariables:
          "You know you need a separate bank account for Direct Payments unless you have an Enham Holding Account",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "25",
    },
    29: {
      responseContent: {
        templateVariables: "You have read Direct Payment policy and guidance",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "26",
    },
    30: {
      responseContent: {
        templateVariables:
          "You fully understand your responsibilities as a DP recipient",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "27",
    },
    31: {
      responseContent: {
        templateVariables:
          "You understand Client contribution and personal top up",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "28",
    },
    32: {
      responseContent: {
        templateVariables:
          "You know to contact the Local Authority if circumstances change",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "29",
    },
    33: {
      responseContent: {
        templateVariables: "You know what records you have to keep for audits",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "30",
    },
    34: {
      responseContent: {
        templateVariables:
          "The bank account you will use is just for the direct payment",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "31",
    },
    35: {
      responseContent: {
        templateVariables:
          "You understand that if you do not complete the paperwork you will not receive your Direct Payment funding",
      },
      responseType: "template",
      templateKey: "enham_payroll_quiz_questions",
      question: "32",
    },
    36: {
      responseContent: {
        templateVariables: "You may now ask questions about Direct Payments",
      },
      responseType: "template",
      templateKey: "enham_quiz_end",
    },
  },
};
const enhamDemoConfig = {
  1: {
    3: {
      responseContent: {
        templateVariables: "Hi Matt, It’s really nice to meet you.",
        mediaId: "1ikeDaWpc35J1NZ0nFV8xcZD363GiinTY",
      },
      responseType: "template",
      templateKey: "media",
      buttonTemplateConfig: {
        sendButtonTemplate: true,
        buttonTemplateKey: "demo_change_language",
        buttonTemplateContent: {
          templateVariables:
            "Would you like to change language or keep English?",
        },
      },
    },
    4: {
      responseContent: {
        templateVariables:
          "Please could you press on the camera or the microphone button and say a few words to me about your experience with direct payments so far",
        mediaId: "1I2h6-FgXH6JLkXXccV5yVOn-z96TVM4j",
      },
      responseType: "template",
      templateKey: "media",
      buttonTemplateConfig: {
        sendButtonTemplate: false,
      },
    },
    5: {
      responseContent: {
        templateVariables:
          "Before we get started on the learning, feel free to ask me any questions, which you can do throughout the videos too",
        mediaId: "1abXE9FSAchfJy3mQCzEWWn_iVHjGzTkT",
      },
      buttonTemplateConfig: {
        sendButtonTemplate: true,
        buttonTemplateKey: "demo_start_module",
        buttonTemplateContent: {
          templateVariables:
            "Before we get started on the learning, feel free to ask any questions",
        },
      },
      responseType: "template",
      templateKey: "media",
    },
    7: {
      responseContent: {
        templateVariables:
          "“Direct payments cannot be used to pay for services from a partner or close relative living in the same household, unless there are agreed exceptional circumstances",
        mediaId: "142yilkQ5P83OCkj-9x5Se_mWh2Sj-I9T",
      },
      buttonTemplateConfig: {
        sendButtonTemplate: true,
        buttonTemplateKey: "demo_start_module",
        buttonTemplateContent: {
          templateVariables:
            "Before we get started on the learning, feel free to ask any questions",
        },
      },
      responseType: "template",
      templateKey: "media",
    },
  },
};

const enhamPARegistrationConfig = {
  //the update needs to happen on the property that was before what is being asked about now
  1: {
    2: {
      responseContent: "🙋‍♀️ Please enter your first and last name ",
      responseType: "text",
      templateKey: null,
      profileUpdateConfig: {
        updateUserProfile: false,
      },
    },
    3: {
      responseContent: "☎️ Please enter your phone number",
      responseType: "text",
      templateKey: null,
      profileUpdateConfig: {
        updateUserProfile: true,
        updateKey: "username",
        fieldType: "object",
      },
    },
    4: {
      responseContent: "📧 Please enter your email address",
      responseType: "text",
      templateKey: null,
      profileUpdateConfig: {
        updateUserProfile: true,
        updateKey: "alt_phone_number",
        fieldType: "object",
      },
    },
    5: {
      responseType: "text",
      responseContent: "📮 Please enter your postcode",
      templateKey: null,
      profileUpdateConfig: {
        updateUserProfile: true,
        updateKey: "email_address",
        fieldType: "object",
      },
    },
    6: {
      responseType: "text",
      responseContent:
        "🚗 How far would you be willing to travel up to? Please indicate your answer with the relevant number below: \n\n1. Within 0 - 2 miles\n2. Upto 2 - 5 miles\n3. Upto 5 - 15 miles\n4. 15 + miles",
      templateKey: null,
      profileUpdateConfig: {
        updateUserProfile: true,
        updateKey: "postcode",
        fieldType: "object",
      },
    },
  },
  2: {
    1: {
      responseType: "template",
      responseContent: {
        templateVariables:
          "✅ Please say if you have a portable DBS.\n\nPlease note having one isn't necessary at this stage, but it is helpful to know if you already have one in place. ",
      },
      templateKey: "default_yn",
      profileUpdateConfig: {
        updateUserProfile: true,
        updateKey: "max_travel_distance",
        fieldType: "object",
      },
    },
  },
  3: {
    sectionName: "employment_history",
    1: {
      responseType: "text",
      responseContent:
        "🥰 Please could you share some details (a couple of sentences) of your previous care related experience, examples could include, supporting a family member, working in a paid role, supporting someone with autism, learning or physical disabilities etc.\n\nYou can text or record a voicenote if you'd like. Please share this in one message, you can always add further details at the end",
      templateKey: null,
      profileUpdateConfig: {
        updateUserProfile: true,
        fieldType: "object",
        updateKey: "dbs",
      },
    },
  },
  4: {
    sectionName: "skills_and_qualifications",
    1: {
      responseType: "text",
      responseContent:
        "👩‍🏫 Please could you share some details of any qualifications you may have eg NVQs or Care certificates. Qualifications aren't necessary, but feel free to share anything which might be relevant.\n\nYou can text or record a voicenote if you'd like. Please share this in one message, you can always add further details at the end.",
      templateKey: null,
      profileUpdateConfig: {
        fieldType: "object",
        updateUserProfile: true,
        updateKey: "relevant_experience",
      },
    },
    2: {
      responseType: "text",
      responseContent:
        "🗣️ Please could you share if you speak any other languages fluently aside from English (eg Polish 🇵🇱, Welsh 🏴󠁧󠁢󠁷󠁬󠁳󠁿, Gujarati , Urdu 🇵🇰, Hindi 🇮🇳, Bengali 🇧🇩, Arabic, Ukrainien 🇺🇦, Punjabi 🇮🇳, Amharic 🇪🇹), British Sign Language, Makaton.\n\nPlease write n/a if not applicable.",
      profileUpdateConfig: {
        fieldType: "object",
        updateUserProfile: true,
        updateKey: "qualifications",
      },
    },
  },
  5: {
    1: {
      responseType: "text",
      responseContent:
        "🕐 Please choose all of the below days and times you can work. If you have any further availability notes you can state in the next question. Please choose as many options as make sense, and write eg '1, 2, 4'\n\n1. Weekdays\n2. Weekends\n3. Mornings (6am - 11am)\n4. Afternoons (11am - 4pm)\n5. Evenings (4pm - 8pm)\n6. Nights (8pm - midnight)\n7. Overnight\n8. Bank holidays",
      templateKey: null,
      profileUpdateConfig: {
        fieldType: "object",
        updateUserProfile: true,
        updateKey: "languages",
      },
    },
    2: {
      responseType: "text",
      responseContent:
        "📝 Please state if there is anything else we need to know about your availability",
      templateKey: null,
      profileUpdateConfig: {
        fieldType: "object",
        updateUserProfile: true,
        updateKey: "availability_days_times",
      },
    },
    3: {
      responseType: "text",
      responseContent:
        "👍 Please choose all of the below areas you would be willing to consider.\n\n1. Supporting someone on holiday abroad.\n2. Supporting someone on holiday in the UK",
      templateKey: null,
      profileUpdateConfig: {
        updateUserProfile: true,
        fieldType: "array",
        updateKey: "availability_considerations",
      },
    },
    4: {
      responseType: "text",
      responseContent:
        '❤️ Please state if you have any preferences for the type of care you do. Please choose as many as you like, and write eg "1, 2, 4"\n\n1. Personal care (eg washing hair, showering)\n2. Household Tasks (eg hoovering, shopping)\n3. Healthcare tasks (eg tube feeding)\n4. Companionship at home\n5. Companionship in the community\n6. No preferences, happy to get stuck in wherever',
      templateKey: null,
      profileUpdateConfig: {
        updateUserProfile: true,
        updateKey: "work_flexibility",
        fieldType: "object",
      },
    },
    5: {
      responseType: "text",
      responseContent:
        "🎡 Please state which of the following transport you are happy to engage with. Please choose as many options as make sense, and write eg \"1, 2, 3\" \n\n1. Accompanying someone on public transport\n2. Driving someone else's car (they'd have the insurance in place for this)\n3. Happy to use your car for work related tasks (you'd need business insurance in order to do this)",
      profileUpdateConfig: {
        updateUserProfile: true,
        updateKey: "work_type_preferences",
        fieldType: "object",
      },
    },
  },
  6: {
    1: {
      responseType: "template",
      templateKey: "default_yn",
      responseContent: {
        templateVariables:
          "Thanks for all your answers so far! You are almost finished 🥰\n\n🧑 Please confirm that a potential employer may be able to contact a reference if needed",
      },
      profileUpdateConfig: {
        updateUserProfile: true,
        updateKey: "transport_preferences",
        fieldType: "object",
      },
    },
  },
  7: {
    1: {
      responseType: "template",
      responseContent: {
        templateVariables:
          "👋 Please confirm on what basis you are happy for us to message you again over WhatsApp, to check your availability & other details are up to date ",
      },
      templateKey: "enham_pa_scheduling",
      profileUpdateConfig: {
        updateUserProfile: true,
        updateKey: "references",
        fieldType: "object",
      },
    },
  },
  8: {
    1: {
      responseType: "template",
      responseContent: {
        templateVariables:
          '➕ If there is anything else you would like to add, such as any other information / or a photo / a CV etc - please send us this now and we will add as a note ☺️\n\nIf there is nothing to add, please select "Next" below',
      },
      templateKey: "default_next_section",
      profileUpdateConfig: {
        updateUserProfile: true,
        updateKey: "availability_check_frequency",
        fieldType: "object",
      },
    },
    2: {
      responseType: "template",
      responseContent: {
        templateVariables:
          '🙋‍♀️ If you have any further questions about the PA register process, please let us know here and a member of the team will aim to get back to you within a 2 week time period\n\nIf there are no questions, please select "Next" below',
      },
      templateKey: "default_next_section",
      profileUpdateConfig: {
        updateUserProfile: true,
        updateKey: "notes",
        fieldType: "array",
      },
    },
  },
  9: {
    1: {
      profileUpdateConfig: {
        updateUserProfile: true,
        updateKey: "further_questions",
        fieldType: "object",
      },
    },
  },
};
const enhamPADetailCheckConfig = {
  2: {
    //section 2 will handle user availability update
    1: {
      responseType: "text",
      responseContent:
        "Ok sure - please answer the availability question again: \n\n🕐 Please choose all of the below days and times you can work. If you have any further availability notes you can state in the next question. Please choose as many options as make sense, and write eg '1, 2, 4'\n\n1. Weekdays\n2. Weekends\n3. Mornings (6am - 11am)\n4. Afternoons (11am - 4pm)\n5. Evenings (4pm - 8pm)\n6. Nights (8pm - midnight)\n7. Overnight\n8. Bank holidays",
      profileUpdateConfig: {
        updateUserProfile: false,
      },
    },
    2: {
      responseType: "template", //change to template
      responseContent: {
        templateVariables:
          "Thank you - 📝 Please state if there is anything else we need to know about your availability.\n\nPlease answer in one message only.\n\nIf not, please press 'Next'",
      },
      templateKey: "default_next_section",
      profileUpdateConfig: {
        updateUserProfile: true,
        updateKey: "availability_days_times",
        fieldType: "object",
      },
    },
  },
  3: {
    1: {
      profileUpdateConfig: {
        updateUserProfile: true,
        updateKey: "availability_considerations",
        fieldType: "array",
      },
    },
    2: {
      responseType: "text",
      responseContent:
        "Ok sure - please state your new postcode.\n\nPlease answer in one message only",
      //previous message will be either note to availability or null
      profileUpdateConfig: {
        updateUserProfile: false,
      },
    },
  },
  4: {
    1: {
      profileUpdateConfig: {
        updateUserProfile: true,
        updateKey: "postcode",
        fieldType: "object",
      },
    },
    2: {
      responseType: "text",
      responseContent:
        "Ok sure - please answer the maximum travel distance question again:\n\n 🚗 How far are you willing to travel from your postcode. Please choose from the options below:\n\n1. Within 0 - 2 miles\n2. Upto 2 - 5 miles\n3. Upto 5 - 15 miles\n4. 15 + miles",
      //previous message will be either note to postcode or null
      profileUpdateConfig: {
        updateUserProfile: false,
      },
    },
  },
  5: {
    1: {
      profileUpdateConfig: {
        updateUserProfile: true,
        updateKey: "max_travel_distance",
        fieldType: "object",
      },
    },
    2: {
      responseType: "text",
      responseContent:
        "Ok sure - please state your other updates ✍️. \n\nPlease answer in one message only.",
      //previous message will be  distance update
      profileUpdateConfig: {
        updateUserProfile: false,
      },
    },
  },
  6: {
    1: {
      profileUpdateConfig: {
        updateUserProfile: true,
        updateKey: "notes",
        fieldType: "array",
      },
    },
    2: {
      responseType: "text",
      responseContent:
        "Ok sure - I’ll check-in then ☺️ \n\nHave a lovely rest of your day ☀️",
      profileUpdateConfig: {
        updateUserProfile: true,
        updateKey: "availability_check_frequency",
        fieldType: "object",
      },
    },
  },
};
module.exports = {
  enhamPayrollQuizConfig,
  enhamDemoConfig,
  enhamPARegistrationConfig,
  enhamPADetailCheckConfig,
};
