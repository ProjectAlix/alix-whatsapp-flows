const { response } = require("express");

const fatMacysSurveyConfig1 = {
  1: {
    2: {
      responseContent:
        "Great\n\nSection 1 of 7: About you\n\n1A) What stage of the Fat Macy’s programme are you at?\n\nREPLY With the Right number.\n\n1: Completing my trial period\n\n2: Completing my 200 hours of work experience\n\n3: I have completed 200 hours of work experience but not yet used my Move On Grant\n\n4: I used my Move On Grant less than 6 months ago\n\n5:I used my Move On Grant between 6 months and 2 years ago",
      responseType: "text",
      templateKey: null,
      question: "1A",
    },
    3: {
      responseContent: {
        templateVariables: "1B) Are you happy for us to record your name?",
      },
      responseType: "template",
      templateKey: "survey_1b",
      question: "1B",
    },
    4: {
      responseContent: {
        templateVariables:
          "1C) Are you happy for us to ask about your answers on this form?",
      },
      responseType: "template",
      templateKey: "survey_1c",
      question: "1C",
    },
  },
  2: {
    1: {
      responseContent: {
        templateVariables:
          "Great thank you.\n\nPlease note you can’t go back and change answers on this survey.\n\nSection 2 of 7: Workplace training\n\nWhen answering these questions, think about the training hours you’ve completed in the restaurant or at events at other venues.\n\n2A) Have you completed any training with Fat Macy’s since March 2024?\n\nThis could include your trial sessions or any other sessions contributing to your 200 hours. This can be at Sohaila, at events, or at the Lexington cafe.",
      },
      responseType: "template",
      templateKey: "survey_2a",
      question: "2A",
    },
    2: {
      responseContent: {
        templateVariables:
          "2B) How would you rate the work experience and training part of the Fat Macy's Milestone Programme?",
      },
      responseType: "template",
      templateKey: "survey_2b",
      question: "2B",
    },
    3: {
      responseContent:
        "2C) Please complete this sentence. Please answer in one message rather than several messages.\n\n“When I think about my training hours with Fat Macy's, I feel...”",
      responseType: "text",
      templateKey: null,
      question: "2C",
    },
    4: {
      responseContent: {
        templateVariables:
          "2D) Thank you for sharing. We often have sessions on the rota which we cannot fill. How could Fat Macy’s support you to complete more hours?\n\nPlease answer using a voice note or text message",
        mediaId: "1K0r1c4cPNxmso92yK1IoQbTF4PpXEhAK",
      },

      responseType: "template",
      templateKey: "survey_image",
      question: "2D",
    },
  },
  3: {
    1: {
      responseContent: {
        templateVariables:
          "Thanks for sharing your thoughts!\n\nSection 3 of 7: The Lexington\n\n3A) Have you completed any training sessions with the Lexington?",
      },
      responseType: "template",
      templateKey: "survey_2a", //3A is same as 2A no need for new template here
      question: "3A",
    },
    2: {
      responseContent: {
        templateVariables:
          "When thinking about your answers to these questions, you should think about any sessions you have completed at Lexington and the Lexington staff.\n\n3B) How would you rate the training you have received from the Lexington team?",
      },
      responseType: "template",
      templateKey: "survey_2b",
      question: "3B",
    },
    3: {
      responseContent: {
        templateVariables:
          "3C) How would you rate your experience of communicating and working with the Lexington team generally?",
      },
      responseType: "template",
      templateKey: "survey_2b",
      question: "3C",
    },
    4: {
      responseContent: {
        templateVariables:
          "3D) Please complete this sentence using a voice note or text message:\n\n'When I think about my sessions with Lexington, I feel...'",
        mediaId: "1ARp3EbkuMqea9heairj8ivmVt4OITEfP",
      },
      responseType: "template",
      templateKey: "survey_image",
      question: "3D",
    },
  },
  4: {
    1: {
      responseContent: {
        templateVariables:
          "Thanks for sharing your thoughts!\n\nSection 4 of 7: Support from Fat Macy's\n\nWhen answering these questions, think about the support you've received from your Progression & Engagement Officer or anyone else on the charity team.\n\n4A) How would you rate the support you receive from the Progression & Engagement Team?",
      },
      responseType: "template",
      templateKey: "survey_2b",
      question: "4A", //is a list cant skip this one
    },
    2: {
      responseContent: {
        templateVariables:
          "4B) Please complete this sentence using a voice note or text message:\n\n'When I think about the 1:1 support I've received from Fat Macy's, I feel...'",
        mediaId: "1rCsPpNKSm4_cUHD7MfC93tC2kMx49XCZ",
      },
      responseType: "template",
      templateKey: "survey_image",
      question: "4B",
    },
  },
  5: {
    1: {
      responseContent: {
        templateVariables:
          "Thanks for sharing your thoughts 🥰\n\nSection 5 of 7: Applying for Grants\n\n5A) Have you applied for your Housing Deposit Grant yet?",
      },
      responseType: "template",
      templateKey: "survey_2a",
      question: "5A",
    },
    2: {
      responseContent: {
        templateVariables:
          "5B) How would you rate your experience of applying for your Housing Deposit Grant?",
      },
      responseType: "template",
      templateKey: "survey_2b",
      question: "5B",
    },
    3: {
      responseContent:
        "5C) Please answer the following:\n\n1. What is / was helpful about the application process?\n2. How could we improve the application process?",
      responseType: "text",
      templateKey: null,
      question: "5C",
    },
  },
  6: {
    1: {
      responseContent: {
        templateVariables:
          "Thanks for sharing your thoughts 🥰\n\nSection 6 of 7: Communication with Fat Macy’s\n\n6A) How would you rate your experience of communicating and working with the Fat Macy's Team generally?\n\nWhen answering this question, you should consider your communication with all the staff - charity and restaurant team members.",
      },
      responseType: "template",
      templateKey: "survey_2b",
      question: "6A",
    },
    2: {
      responseContent: {
        templateVariables:
          "6B) Please complete this sentence using a voice note or text:\n\n'When I think about the the Fat Macy's team, I feel...'",
        mediaId: "1U7EoLzonNp6gTnJBCQ54QQz31_VXHbmd",
      },
      responseType: "template",
      templateKey: "survey_image",
      question: "6B",
    },
    3: {
      responseContent: {
        templateVariables:
          "6C) How would you rate the way Fat Macy's shares information about the programme and the services it offers?",
      },
      responseType: "template",
      templateKey: "survey_2b",
      question: "6C",
    },
    4: {
      responseContent:
        "6D) Which of these Fat Macy’s services are you aware of?\n\nPlease REPLY separating the numbers of services with a comma, i.e: '1,2,'\n\n1. Counselling\n\n2. Life coaching\n\n3. Career mentoring\n\n4. CV and interview workshops\n\n5. Benefits and budgeting advice\n\n6. Day trips and social events",
      responseType: "text",
      templateKey: null,
      question: "6D",
    },
    5: {
      responseContent: {
        templateVariables:
          "6E) Do you read the monthly Fat Macy’s Trainee Newsletter? \n\nREPLY With the Right number.\n\n1: I didn't know there was a newsletter\n\n2: I knew about the newsletter, but I don't ever read it\n\n3: I skim the newsletter, but don't read it in detail\n\n4: I sometimes read the newsletter \n\n5: I always read the newsletter",
        mediaId: "10J7s_-QhG5GvQMdkW7OjrtoUDn2OJ-_3",
      },
      responseType: "template",
      templateKey: "survey_image",
      question: "6E",
    },
    6: {
      responseContent: {
        templateVariables:
          "6F) Fat Macy's tries to share stories about our current trainees.\n\nPlease complete this sentence using a voice note or text message:\n\n'When I read/hear stories about other trainees' successes, I feel...'",
        mediaId: "1eQ1neemWT0-mZMMn-PqY63IarZXWC_89",
      },
      responseType: "template",
      templateKey: "survey_image",
      question: "6F",
    },
  },
  7: {
    1: {
      responseContent: {
        templateVariables:
          "Thanks for sharing your thoughts 🥰\n\nSection 7 of 7: Final reflections\n\n7A) Please choose how much you agree with 'I feel a sense of belonging at Fat Macy’s'",
      },
      responseType: "template",
      templateKey: "survey_7a",
      question: "7A",
    },
    2: {
      responseContent: {
        templateVariables:
          "7B) Please choose how much you agree with 'I feel able to bring my authentic self to Fat Macy’s'",
      },
      responseType: "template",
      templateKey: "survey_7a",
      question: "7B",
    },
    3: {
      responseContent: {
        templateVariables:
          "7C) Please choose how much you agree with 'I feel like my voice matters at Fat Macy's'",
      },
      responseType: "template",
      templateKey: "survey_7a",
      question: "7C",
    },
    4: {
      responseContent: {
        templateVariables:
          "7D) Please answer the following using a voice note or text message:\n\n1. What has worked well during your time at Fat Macy’s\n2. What hasn’t worked well?\n3. How could we improve the trainee and graduate experience at Fat Macy’s?",
        mediaId: "1XeWmd_wMkxhLa0IgOV4CNMKxzLo-q-9c",
      },
      responseType: "template",
      templateKey: "survey_image",
      question: "7D",
    },
    5: {
      responseContent: {
        templateVariables:
          "7E) How likely are you to recommend Fat Macy’s to a friend?",
      },
      responseType: "template",
      templateKey: "survey_7e",
      question: "7E",
    },
    6: {
      responseContent: {
        templateVariables:
          "Thanks so much for completing this survey!\n\nYour feedback is really appreciated.  It's really important that we listen to what you have to share 🥰 \n\nWe will share the results of the survey and the changes we will make at Fat Macy's in November.\n\nGet in touch if there is anything we can help with!",
        mediaId: "1zSM-zzZn1BBs2J5uysbWZhJsz2kNxnHZ",
      },
      responseType: "template",
      templateKey: "survey_image",
    },
  },
};

const fatMacysSurveyConfig2 = {
  1: {
    2: {
      responseContent: {
        templateVariables: "Did you attend the:",
      },
      responseType: "template",
      templateKey: "social_survey_1",
      question: "1",
    },
    3: {
      responseContent: {
        templateVariables:
          "Did you attend as a graduate receiving a certificate for completing the programme?",
      },
      responseType: "template",
      templateKey: "social_survey_yes_no",
      question: "2",
    },
    4: {
      responseContent: {
        templateVariables:
          "Has attending this event given you an increased sense of accomplishment?",
      },
      responseType: "template",
      templateKey: "social_survey_yes_no_ns",
      question: "3",
    },
    5: {
      responseContent: {
        templateVariables:
          "Has attending this event given you an increased sense of motivation to achieve your goals?",
      },
      responseType: "template",
      templateKey: "social_survey_yes_no_ns",
      question: "4",
    },
    6: {
      responseContent: {
        templateVariables:
          "Do you feel attending this event has increased your sense of belonging with Fat Macy’s?",
      },
      responseType: "template",
      templateKey: "social_survey_yes_no_ns",
      question: "5",
    },
    7: {
      responseContent: {
        templateVariables:
          "What did you enjoy about the event?\n\nPlease share a few words or a voicenote :)",
        mediaId: "1kVjMHI1oE3XEdiW-h0Duu-_lX0kvl-n9", //Q1
      },
      responseType: "template",
      templateKey: "survey_image",
      question: "6",
    },
    8: {
      responseContent: {
        templateVariables:
          "Final question! Do you have any feedback, thoughts or ideas for Fat Macy's trainee socials?\n\nPlease share a few words or a voicenote :) ",
        mediaId: "1r0sQ8I6Dp4omJR4s7BSl6fWDDSiVH-5V", //q6
      },
      responseType: "template",
      templateKey: "survey_image",
      question: "7",
    },
    9: {
      responseContent: {
        templateVariables:
          "Great - thanks so much for sharing!\n\nWish you a great week ahead",
        mediaId: "182GSiDvpjI7zFyJETt9W7ATeXErHkYDc",
      },
      responseType: "template",
      templateKey: "survey_image",
      question: "ending_1",
    },
    10: {
      responseContent: {
        templateVariables: "No problem!\n\nHave a great day!",
        mediaId: "182GSiDvpjI7zFyJETt9W7ATeXErHkYDc",
      },
      responseType: "template",
      templateKey: "survey_image",
      question: "ending_2",
    },
  },
};

module.exports = {
  fatMacysSurveyConfig1,
  fatMacysSurveyConfig2,
};
