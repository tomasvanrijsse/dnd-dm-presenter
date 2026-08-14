export interface DanceEventBlock {
  afterRound: number
  summary: string
  events: string[]
}

export const danceEvents: DanceEventBlock[] = [
  {
    afterRound: 0,
    summary: 'Pre-dance: Milton (doses Maximillian’s drink and) unpacks, Morgen stores his instruments at Silver Lodge.',
    events: [
      'During the day, Maximillian drinks too much, and Lillian notices that Milton adds a potion to his drinks. The potion is a vial of antidote.',
      'After the picnic, Morgen leaves his musical instruments in a servants’ room at Silver Lodge.',
      'Milton unpacks Maximillian’s luggage, checks that everything is in order, and prepares refreshments.',
      'The dancing begins. Morgen takes pity on Roslinda, who is sitting down, and asks her to dance. Roslinda is so happy about this that she forgets her purse on the chair.',
      ]
  },
  {
    afterRound: 1,
    summary: 'Roslinda searches for her purse and hears Lillian and Sirbastian talk',
    events: [
      'Roslinda notices that her purse is gone, and begins to search for it.',
      'Roslinda stumbles upon Lillian and Sirbastien, who are having a secret conversation. Roslinda catches only part of the conversation and hides behind a bush.',
      'Roslinda sees Sirbastien head towards Silver Lodge.',
    ]
  },
  {
    afterRound: 2,
    summary: 'Sirbastien sabotages the wedding wine, seen by Dizzy and Thalgion who is hiding.',
    events: [
      'Sirbastien adds a sleeping draught to the wine decanter in Lÿsandrea and Maximillian’s bedroom to sabotage their wedding night. His actions are seen by Dizzy the Dragon and Thalgion, who has left the dancing and snuck up to Silver Lodge.'
    ]
  },
  {
    afterRound: 3,
    summary: 'Sirbastien returns to the dance; Galïanne and Maximillian quarrel at Silver Lodge.',
    events: [
      'Sirbastien leaves Silver Lodge and returns to the dance.',
      'Galïanne meets Maximillian at Silver Lodge, and they quarrel. Dizzy the Dragon hears them fight but never sees Galïanne, so Dizzy thinks that it is Maximillian and Lÿsandrea who are arguing.'
    ]
  },
  {
    afterRound: 4,
    summary: 'Thalgion murders Maximillian; Lÿsandrea starts searching for him and asks the characters for help.',
    events: [
      'Thalgion is hiding in the library at Silver Lodge and hears them fight as well. He waits for Galïanne to leave and then ruthlessly pushes Maximillian from the veranda. Thalgion places Roslinda’s purse next to the body. Thalgion returns to the dancing.',
      'Lÿsandrea begins to search for Maximillian. When she can’t find him, she looks for the characters and asks them to help her.'
    ]
  }
]
