export interface NpcInfo {
  role: string
  appearance: string
  gear: string
  trait: string
  ideal: string
  bond: string
  flaw: string
  sections: { title: string, body: string }[]
}

export type Gender = 'female' | 'male'

export interface Npc {
  id: string
  name: string
  image: string
  gender: Gender
  info: NpcInfo
}

export const npcs: Npc[] = [
  {
    id: 'lysandrea-isillionthe',
    name: 'Lysandrea Isillionthe',
    image: '/NPCs/Lysandrea-Isillionthe.jpg',
    gender: 'female',
    info: {
      role: 'Female half-elf noble (LN)',
      appearance: 'Lÿsandrea (or Lÿs as her close friends call her) has long, brown curly hair and a heart-shaped face. A sprinkle of freckles covers her nose, and her elven heritage is evident in her slender shape and pointed ears. Lÿsandrea wears a traditional elven bridal gown, a sleeveless and loosely cut white dress decorated with silver embroidery. Her curly hair is arranged with multiple pearl-studded pins. Lÿsandrea has been persuaded by her family to marry Maximillian D’arlington, but he has no place in her heart. However, during the courtship when the families spent plenty of time together, Lÿsandrea and Sirbastien, Maximillian’s younger brother, secretly fell in love with each other.',
      gear: 'Lÿsandrea wears a Ring of Resistance (poison).',
      trait: 'I’m naturally good-hearted and always think well of others.',
      ideal: 'Loyalty. It is my duty to obey my family. (Lawful)',
      bond: 'I am deeply in love with someone whom I can’t have.',
      flaw: 'My pride and loyalty may lead me to perpetual unhappiness.',
      sections: [
        { title: 'Information', body: 'Lÿsandrea speaks warmly about her family but occasionally mentions that she misses her adventuring days. If asked, she will admit that she isn’t fervently in love with her fiancé, but she believes that they might grow closer with time. She marries to please her family and because she feels it is her duty. Her father especially has always strived for Lÿsandrea and her sister to marry well.' },
        { title: 'What she lies about', body: 'Lÿsandrea is deeply in love with Maximillian’s brother, Sirbastien. However, since Maximillian is the oldest heir and will inherit his family’s wealth, Sirbastien has neither title nor money. Therefore, their families would never agree to a match between Lÿsandrea and Sirbastien. Lÿsandrea lies to herself and wants to believe that she will with time forget Sirbastien and instead develop sufficiently warm feelings for Maximillian to live a tolerable life. Lÿsandrea will also lie – without hesitation or guilt – to protect Sirbastien. She hopes that Maximillian has died in an accident, and she will never believe that Sirbastien would be guilty of murder.' },
        { title: 'What she hides', body: 'Lÿsandrea knows that Roslinda is a warlock, but she is reluctant to share this information, since warlocks tend to have a dark reputation. She believes that Roslinda naïvely has made a pact with a fiend and wants to protect her friend. What Lÿsandrea doesn’t know is that while Roslinda is indeed a warlock, her pact is in fact with an archfey.' },
        { title: 'Motive for murder', body: 'Lÿsandrea didn’t kill Maximillian, but she has a strong motive: If he died, Sirbastien would inherit both the family fortune and the title, which would enable them to be married.' },
        { title: 'How to vex or woo her', body: 'Lÿsandrea is open to friendship, but her heart truly belongs to Sirbastien, regardless of what she is trying to tell herself. Conversations about the value of loyalty or love will win her fondness. However, Lÿsandrea will be annoyed if anyone harshly criticises her decision to marry Maximillian or questions her friendship with Roslinda.' }
      ]
    }
  },
  {
    id: 'galianne-isillionthe-fitzgilbert',
    name: 'Galianne Isillionthe Fitzgilbert',
    image: '/NPCs/Galianne-Isillionthe-Fitzgilbert.jpg',
    gender: 'female',
    info: {
      role: 'Female half-elf noble (LN)',
      appearance: 'Galïanne is willowy and has sharp cheekbones and long, brown hair. She is dressed in a traditional elven dress in dark grey with a silvery sash belt. A silver circlet with empty sockets rests on her head, and she also wears a mourning ring with a braided strand of hair. The grey dress and the empty sockets indicate that someone close to her has died within the past five years. Indeed, Galïanne became a widow three years ago when her husband, Jonah FitzGilbert, passed away.',
      gear: 'Galïanne wears Boots of Elvenkind and carries a small silver dagger that she uses as a letter opener.',
      trait: 'Only rarely do I share my feelings, but I am a good listener.',
      ideal: 'Family. Blood runs thicker than water. (Neutral)',
      bond: 'I will do anything to protect my family.',
      flaw: 'I hide the most scandalous secret that could ruin my reputation forever.',
      sections: [
        { title: 'Information', body: 'Galïanne claims that the marriage between Lÿsandrea and Maximillian is a good match. Galïanne and Lÿsandrea’s father has always wanted his daughters to marry well, and the Isillionthë and D’arlington families are pleased about uniting their families. The families have been close for decades ever since Galïanne and Lÿsandrea’s father did business together with the late Lord D’arlington and helped him buy land for mining activities around Coppertown.' },
        { title: 'What she lies about', body: 'Galïanne describes her late husband as exceedingly kind and very handsome, which isn’t entirely true. Galïanne will also lie about the brief affair that she had with Maximillian years before she married. The only other person who knows about the liaison is Milton, who has never spoken a word about it. During the dance, Galïanne met Maximillian at Silver Lodge to ask him to promise that he would never tell Lÿsandrea about their affair. However, Maximillian only laughed at her request, and in anger Galïanne slapped him across his face. If Galïanne is asked why she left during the dancing, she says that she helped search for Roslinda’s lost purse. However, Thalgion overheard Galïanne and Maximillian’s disagreement and will tell anyone that he saw Galïanne return from Silver Lodge and that she looked upset.' },
        { title: 'What she hides', body: 'Galïanne doesn’t really want Lÿsandrea to marry Maximillian. Galïanne married for duty herself, but her marriage was unhappy and became a gloomy cage. Three years ago, when Galïanne’s husband, Jonah, choked on a chicken bone at dinner, she panicked and fled the room. Jonah perished, and Galïanne blames herself for her husband’s death. Her guilt is overwhelming, especially since she neither loved nor mourned him. Galïanne is afraid that Lÿsandrea will repeat her mistake and enter a loveless marriage with Maximillian. However, Galïanne doesn’t dare to try to persuade her to abandon the wedding plans, since she doesn’t want to confess her lack of true feelings towards her late husband.' },
        { title: 'Motive for murder', body: 'Galïanne didn’t kill Maximillian, but she has several strong reasons for wanting him dead. Maximillian could have ruined her reputation if he told anyone about their affair. In addition, his premature death would save Lÿsandrea from becoming trapped in a loveless marriage.' },
        { title: 'How to vex or woo her', body: 'Galïanne can appear to be aloof and cold, but she is a keen reader and loves elvish literature. She will defend the honour of her sister and family and become irritated if anyone suggests that Lÿsandrea had something to do with the murder.' }
      ]
    }
  },
  {
    id: 'thalgion-isillionthe',
    name: 'Thalgion Isillionthe',
    image: '/NPCs/Thalgion-Isillionthe.jpg',
    gender: 'male',
    info: {
      role: 'Male high elf knight (LN), distant cousin to Lÿsandrea and Galïanne',
      appearance: 'Thalgion is slender and has elegant features and captivating almond-shaped eyes. Thalgion wears a traditional elven costume that features a high-collared silk shirt, tailored wide-sleeved robe, and an embroidered long dark blue cloak. His long hair is neat, and he wears a silver circlet that indicates that he is a member of the high elven court. Thalgion is serious, reserved, and speaks articulately with a melodious elven accent.',
      gear: 'Thalgion carries an engraved Longsword +1, which is a traditional part of his noble’s outfit. He also wears Bracers of Defense and a Ring of the Elven Court.',
      trait: 'Most people are far beneath me, but I hide my disapproval of them well.',
      ideal: 'Loyalty. Death before dishonour. (Lawful)',
      bond: 'I am strongly devoted to the royal family and the elven court.',
      flaw: 'In secret, I believe that high elves are more sophisticated and superior to all others.',
      sections: [
        { title: 'Information', body: 'Thalgion is very proud to be a member of the Isillionthë family, even if he disapproves of Lÿsandrea and Galïanne’s elven mother marrying a human. He is more than pleased to talk about the family’s connections to the royal family and the high elven court. During the evening when Maximillian is murdered, Thalgion saw Sirbastien head towards Silver Lodge. Thalgion will use this information to frame Sirbastien for the murder.' },
        { title: 'What he lies about', body: 'Thalgion doesn’t want to admit to anyone that he once was – and still is! – ardently in love with Lÿsandrea. He offered to marry her, but she declined his proposal. Later, when Lÿsandrea’s engagement to Maximillian was announced, Thalgion erroneously concluded that Lÿsandrea had turned him down because she had romantic feelings for Maximillian. Although deeply hurt and aflame with jealousy, Thalgion solemnly respected Lÿsandrea’s choice. But then Thalgion discovered that Maximillian only wanted to marry Lÿsandrea to get his hands on Silver Lodge and open a mine at Argentïs Falls, an area that is considered sacred to the elves. Thalgion’s hatred for Maximillian reached new heights – and Thalgion decided to take drastic action by doing away with Maximillian. Thalgion noticed that Roslinda left her purse behind when Morgen asked her to dance. During the dance, Thalgion stole the purse. After Thalgion killed Maximillian, he placed the purse near Maximillian’s body to draw suspicion from himself. Therefore, Thalgion followed Maximillian to Silver Lodge when he was meeting Galïanne. Once Maximillian was alone, Thalgion snuck up behind him and ruthlessly pushed him over the veranda’s railing. Maximillian, who was quite drunk and dazed by the sleeping draught mixed into his wine, broke his neck from the fall and died immediately.' },
        { title: 'What he hides', body: 'Thalgion overheard Galïanne and Maximillian’s quarrel, but he doesn’t want to share this information, as their old secret affair could bring shame to the Isillionthë family. Thalgion claims that he never went to Silver Lodge during the dancing. However, if someone figures out that he did, he will eventually admit that he was searching for Lÿsandrea for a private conversation and that he briefly heard Maximillian arguing with someone.' },
        { title: 'Motive for murder', body: 'Thalgion has multiple motives for killing Maximillian. Firstly, he is deeply jealous of Maximillian, since he believes that Lÿsandrea has feelings for him. Secondly, Thalgion is furious that Maximillian wants to marry Lÿsandrea only to acquire Silver Lodge. Thalgion reasons that if he can’t have Lÿsandrea’s love, then no one shall – especially not a lowly cretin who is unworthy of her affections! Thirdly, Maximillian’s disgusting plan to mine around Argentïs Falls borders on blasphemy. The only logical conclusion in Thalgion’s mind is that Maximillian must be stopped permanently, even if doing so unfortunately requires callous murder.' },
        { title: 'How to vex or woo him', body: 'Thalgion prefers the company of other high elves and likes to talk about elven history. He dislikes crude gossip or unpolished behaviour, and he is a little bit of a snob.' }
      ]
    }
  },
  {
    id: 'roslinda-brynborn',
    name: 'Roslinda Brynborn',
    image: '/NPCs/Roslinda-Brynborn.jpg',
    gender: 'female',
    info: {
      role: 'Female gnome mage (CG) who can only cast spells up to 2nd level',
      appearance: 'Roslinda is short, curvy, and has blond hair with natural cupcake pink highlights. She has large eyes and a small gap between her front teeth. On her chin is a faded scar from a childhood accident. Roslinda wears a yellow ballgown with puff sleeves and layers of tulle, which is a gift from Lÿsandrea. Roslinda also carries a velvet pouch that she has sewn and embroidered herself. Roslinda used to work in the kitchen for the Isillionthë family. Despite their different stations, Roslinda and Lÿsandrea became close friends. Lÿsandrea’s father disapproved of their friendship, but eventually decided to hire Roslinda as a lady companion to stop gossip about his daughter’s ill-favoured tendency to mingle with servants.',
      gear: 'Roslinda can cast the spell mage armour.',
      trait: 'I often act a little bit daft so that people will like me more.',
      ideal: 'Kindness. Surely, even the most callous villain is kind-hearted deep down? (Good)',
      bond: 'One day I will learn who my parents are, and why they left me at an orphanage.',
      flaw: 'I try my best to follow social etiquette and manners, but sometimes I forget myself.',
      sections: [
        { title: 'Information', body: 'Roslinda knows the Isillionthë family well, and as a lady companion, she hears plenty of servants’ gossip. She knows that Maximillian has been involved in a scandalous affair, and she once heard him make a flippant comment about Morgen’s time in Hammersong. She has also noticed that Sirbastien has been uncommonly withdrawn lately, and she once heard gossip that Milton keeps a secret. Roslinda is happy to chat and trade idle gossip, but she would never say anything mean. During the evening, Roslinda forgot her purse when Morgen unexpectedly asked her to dance. Roslinda thought that she had lost the purse, and asked several of the guests if they had seen it. However, it was Thalgion who took the purse and later placed it near Maximillian’s dead body.' },
        { title: 'What she lies about', body: 'Roslinda is in fact a warlock. She accidentally made a pact with an archfey and sometimes carries out favours for them. These favours appear whimsical and innocent, but on a few occasions they have had dire consequences. Roslinda remains stubbornly convinced that these must have been pure accidents, since her flawlessly beautiful patron would never intend to cause harm. Roslinda is cleverer than most people assume. She lies smoothly about anything that might hurt Lÿsandrea or cast a shadow over her.' },
        { title: 'What she hides', body: 'Roslinda knows that Lÿsandrea is marrying merely for duty, and that she hopes to develop fond feelings for Maximillian with time. Before the murder, Roslinda heard Sirbastien and Lillian talking in private in the garden while she searched for her purse. She only heard a few snippets: “Should talk to…” “You will regret it…” and, “No one knows about…” Roslinda didn’t want people to believe that she was eavesdropping and hid behind a well-trimmed bush. However, she did see Sirbastien walk towards Silver Lodge afterwards.' },
        { title: 'Motive for murder', body: 'Roslinda didn’t have anything to do with Maximillian’s demise, but she does have motives for seeing him dead. The D’arlington family is proud to a fault, and it is unlikely that Roslinda, who is low born, will be able to continue as Lÿsandrea’s lady companion after the wedding. In addition, if Maximillian dies, Roslinda’s best friend Lÿsandrea wouldn’t have to enter an unhappy marriage.' },
        { title: 'How to vex or woo her', body: 'Roslinda is kind and merry, and it is easy to win her affections. Positive words about her new wide gown make her smile brightly. Anyone who asks her to dance when she is sitting down immediately gains double Admiration Points from her. It is almost impossible to vex Roslinda, but directly cruel or unfair comments will make her see red.' }
      ]
    }
  },
  {
    id: 'miriel',
    name: 'Miriel',
    image: '/NPCs/miriel.jpg',
    gender: 'female',
    info: {
      role: 'Female half-elf bridesmaid, niece to Lÿsandrea’s mother and so her cousin',
      appearance: 'Miriel is warm and quick to laugh, with tightly curled hair pinned up with flowers to match the wedding colours. Her pointed ears and slender build betray the elven blood she inherited from her aunt’s side of the family, just like Lÿsandrea’s. She wears the bridesmaid’s gown chosen by Lÿsandrea and fusses over every small detail of the day, from seating charts to the placement of the flowers.',
      gear: 'Miriel carries no weapon, only a small embroidered clutch with smelling salts, spare hairpins, and a handkerchief.',
      trait: 'I notice everyone’s mood before they’ve said a word, and I can’t help but try to fix it.',
      ideal: 'Family. The people I love come before any occasion, however grand. (Good)',
      bond: 'Lÿsandrea is more sister than cousin to me, and I’d do anything to see her happy.',
      flaw: 'I fuss so much over everyone else’s happiness that I rarely notice my own worries.',
      sections: [
        { title: 'Information', body: 'Miriel is Lÿsandrea’s cousin on her mother’s side, and the two were raised almost like sisters. She was overjoyed to be asked to stand as bridesmaid, and fusses cheerfully over the wedding’s details, happy to gossip about the guests, though she means no harm by it.' },
        { title: 'What she lies about', body: 'Miriel insists to anyone who asks that the wedding is going perfectly and that Lÿsandrea has never looked happier, mostly to keep the mood light and stop guests from prying.' },
        { title: 'What she hides', body: 'Miriel privately worries that Lÿsandrea is not as excited about the marriage as she lets on, but she keeps this worry to herself rather than add to her cousin’s stress on the wedding day.' },
        { title: 'Motive for murder', body: 'Miriel has no motive whatsoever to want Maximillian dead and is horrified by the murder, mostly worried about how it will affect her cousin.' },
        { title: 'How to vex or woo her', body: 'Miriel warms instantly to anyone who is kind to Lÿsandrea or compliments the wedding preparations. She is quick to grow flustered and short-tempered with guests who are rude to the staff or dismissive of the bride.' }
      ]
    }
  },
  {
    id: 'maximillian-darlington',
    name: 'Maximillian D\'arlington',
    image: '/NPCs/Maximillian-D\'arlington.jpg',
    gender: 'male',
    info: {
      role: 'Male human noble (N)',
      appearance: 'Maximillian is tall and good-looking, and his dark eyes make ladies and gentlemen alike swoon over him. Maximillian has naturally coiled hair and a well-trimmed beard. He always wears the latest noble fashion. For the wedding he is dressed in a purple coat trimmed with gold with puffed arms, a matching lilac cloak, tailored trousers, and high boots. Maximillian wasn’t born with a silver spoon in his mouth – he was born with a ruby-studded golden spoon between his lips and nothing else would ever do. As the firstborn, he was doted endlessly upon by his hypochondriac mother, while his father was single-mindedly proud of him regardless of Maximillian’s actions or achievements. However, Maximillian’s father died in an accident, so Maximillian inherited his lordship title and the grand manor together with the full responsibility for the family’s affairs when he was only fifteen years old.',
      gear: 'Maximillian has donned his late father’s elaborate Rapier +1 as part of his outfit. He also wears a discreetly hidden Elven Chain.',
      trait: 'I idolise my dead father and constantly strive to live up to his ideal.',
      ideal: 'Aspiration. I’m quite determined to make something of myself one day. (Neutral)',
      bond: 'I seek to become rich and increase my family’s fortune regardless of the consequences.',
      flaw: 'I am overly proud and would never ask for anyone’s help or advice.',
      sections: [
        { title: 'Information', body: 'Maximillian likes to brag and tell tall tales about his hunting trips and adventures. However, while he might tease or hint about other people’s secrets, Maximillian would never spread directly malicious rumours.' },
        { title: 'What he lies about', body: 'Maximillian once had a short, secret relationship with Galïanne. While Maximillian is far too self-absorbed to fall in love, his feelings towards Galïanne are complicated, especially after she broke off their affair. Maximillian isn’t in love with Lÿsandrea, but wants to marry her to acquire the land around Silver Lodge, which Lÿsandrea will receive as a wedding gift from her family. The profits from the mines that the D’arlington family own around Coppertown are decreasing. This, in combination with Maximillian’s poor judgement and lack of skill in investing, has led to the family’s fortune diminishing. In fact, the D’arlingtons are on the brink of falling on hard times.' },
        { title: 'What he hides', body: 'If asked about Morgen’s secret or Milton’s background, Maximillian won’t share any sensitive information about them. He is too proud to stoop to mundane gossip, but he isn’t above playful comments or teasing remarks. Maximillian knows about Milton Fiends’ background, but since Maximillian is quite fond of his efficient and discreet manservant, he won’t betray him. In addition, since Morgen has been providing free entertainment ever since Maximillian found out that he never attended the Royal Guild of Bards and Minstrels, Maximillian has no reason to let people know about Morgen’s secret.' },
        { title: 'Motive for murder', body: 'Maximillian could have died by his own hand, as a result of succumbing to guilt for losing the family fortune and betraying his late father’s dreams.' },
        { title: 'How to vex or woo him', body: 'Maximillian loves attention and flattery. However, even if it is easy to gain his interest, Maximillian’s true feelings are rarely stirred. Any type of criticism regarding himself, his family, or their affairs can anger Maximillian – and he isn’t above duelling to defend his honour!' }
      ]
    }
  },
  {
    id: 'sirbastien-darlington',
    name: 'Sirbastien D\'arlington',
    image: '/NPCs/Sirbastien-D\'arlington.jpg',
    gender: 'male',
    info: {
      role: 'Male human noble (NG), younger brother to Lord Maximillian D’arlington',
      appearance: 'Like his brother, Sirbastien is tall and has curly, dark-brown hair, and he has a neatly trimmed short beard. He wears the finest noble’s clothes and a sky-blue cape. Despite his elegant clothes and fine upbringing, Sirbastien is ill at ease among strangers and in large gatherings. The D’arlington and Isillionthë families spent considerable time together during the courting period, which was when Sirbastien got to know Lÿsandrea better. Against his own wishes – and better judgement – Sirbastien has fallen in love with Lÿsandrea, and he is now torn between duty and his heart’s desire.',
      gear: 'Like most nobles at the wedding, Sirbastien carries an ornamental, but sharpened, rapier as part of his outfit.',
      trait: 'Despite my noble birth, I don’t see myself above others.',
      ideal: 'Respect. All people deserve to be treated with dignity. (Good)',
      bond: 'My true love has forever stolen my heart.',
      flaw: 'I am hopelessly in love with someone I can’t have because my family would never approve of the match.',
      sections: [
        { title: 'Information', body: 'Sirbastien claims – quite truthfully – that both families are pleased about the upcoming marriage between Lÿsandrea and Maximillian. However, it is no secret that Maximillian and Galïanne were considered a good match by their families before Galïanne accepted another better marriage proposal. Sirbastien is more than willing to talk about his travelling plans. He plans to go on a grand tour around Eastern Farraway directly after the wedding, and he is keen to gather advice about towns and sites that are worth visiting. Sirbastien admits that he has rarely been interested in travelling before, but says that it is time for him to explore the realm and find out what he wants to do with his life.' },
        { title: 'What he lies about', body: 'Sirbastien will lie about his secret engagement with Lÿsandrea to protect them from lewd comments and tardy gossip. However, while Sirbastien claims that he is happy about Maximillian and Lÿsandrea’s union, he has decided to sabotage their wedding night by pouring a sleeping draught into the wine decanter in the bride and groom’s bedroom.' },
        { title: 'What he hides', body: 'The real reason for his travel plans is that Sirbastien can’t stand the idea of seeing Maximillian and Lÿsandrea together. While it is true that he hopes to find his true calling during his grand tour, Sirbastien desperately hopes that extensive travelling might give him time to mend his broken heart. He is also quite determined to stop living in the shadow of his successful brother.' },
        { title: 'Motive for murder', body: 'Sirbastien isn’t responsible for his brother’s death. However, if Sirbastien hears that a wineglass was found near the veranda from where Maximillian fell, Sirbastien will believe that he could have caused his brother’s death. His motive for killing Maximillian is strong: Sirbastien is deeply in love with Lÿsandrea. Maximillian’s death would make it possible for Sirbastien to marry Lÿsandrea, since he will inherit both the title and his family’s fortune.' },
        { title: 'How to vex or woo him', body: 'Sirbastien’s heart has already been claimed, but his friendship can be easily won by the right person. Sirbastien likes to talk about art, and he keeps a large collection of paintings and sculptures. While he is calm and quiet, any negative or disdainful remarks about Lÿsandrea or his sister, Lillian, will prompt Sirbastien to challenge the offender to a duel in a heartbeat!' }
      ]
    }
  },
  {
    id: 'lillian-darlington',
    name: 'Lillian D\'arlington',
    image: '/NPCs/Lillian-D\'arlington.jpg',
    gender: 'female',
    info: {
      role: 'Female half-orc noble (NG)',
      appearance: 'Lillian is strong and athletic, and her auburn hair is curled in ringlets. Lillian wears a stunning evening gown in the latest fashion with elbow gloves, and she carries a fan featuring a hand-painted motif of a dashing hunting scene. Lillian is the youngest of the D’arlington siblings and was adopted as a baby. Initially, Lord and Lady D’arlington were her godparents. However, when Lillian’s biological parents died in quick succession from a fever, she was sent to the D’arlingtons. Lord and Lady D’arlington could have kept Lillian as a ward, but they decided almost immediately to welcome her into their family. Lady D’arlington had always wanted a daughter, and Lord D’arlington felt sorry for the infant girl to become an orphan at such a young age. Lillian shares her brother Maximillian’s love for hunting, and she keeps several falcons and riding horses. Like Sirbastien, Lillian has a keen interest in art and books. However, she finds balls, lavish parties, and social events immensely boring. As the youngest sibling and the only daughter, Lillian is in fact rather spoiled, but she is also open-minded, generous, and courageous.',
      gear: 'Lillian carries a concealed hunting Dagger +1 in one of her boots.',
      trait: 'My life has always been more than comfortable, with few things to distress or annoy me.',
      ideal: 'Honesty. There is no point pretending to be something I’m not. (Neutral)',
      bond: 'I look up to my brothers and sometimes wish I were closer to them in age.',
      flaw: 'I don’t entirely understand how privileged I am.',
      sections: [
        { title: 'Information', body: 'Lillian knows that the marriage between the families will be mutually beneficial, and that Lÿsandrea will receive Silver Lodge as a wedding gift from her parents. The families have grown closer during Maximillian and Lÿsandrea’s courtship, and Lillian hopes that she will be invited to hunting trips to Silver Lodge in the future. Lillian knows about Sirbastien’s travelling plans and wishes to one day go on a grand tour herself when she is older. She greatly admires Lÿsandrea, who spent several years as a part of a travelling adventuring group.' },
        { title: 'What she lies about', body: 'Lillian is the only person who suspects that Sirbastien and Lÿsandrea are ardently in love with each other. She has tried on multiple occasions to persuade Sirbastien to talk to Maximillian. Lillian believes that if Maximillian knew about Sirbastien’s feelings, he would reconsider the marriage. Personally, Lillian thinks that their families might be willing to approve of a union between Sirbastien and Lÿsandrea if they knew the truth. During the evening, Lillian met with Sirbastien and tried to convince him to talk to Maximillian one last time. If anyone asks her about their private conversation, Lillian will say that they talked about travels, and that she wants to join Sirbastien on his grand tour. She will claim that they wanted to keep their travel plans secret from their hypochondriacal and worrisome mother.' },
        { title: 'What she hides', body: 'Lillian saw Milton pour a potion into Maximillian’s drink, but she is reluctant to share this information. Her brother frequently drinks too much, and it isn’t the first time his manservant has been forced to slip a potion into Maximillian’s drink to prevent him from getting completely foxed.' },
        { title: 'Motive for murder', body: 'Lillian didn’t kill Maximillian, but she does have a good motive. If Maximillian dies and Sirbastien is found guilty of the murder, Lillian would inherit both the title and the family’s fortune.' },
        { title: 'How to vex or woo her', body: 'Lillian is outgoing and adventurous. Her friendship – or heart – can be won if you share her love for hunting, nature, art, or books. However, dull gossip and boring tales will win no favours from her. Belittling comments about her background or upbringing will make Lillian furious. Although she is a highborn lady, it won’t prevent her from getting into a fist fight if she is provoked.' }
      ]
    }
  },
  {
    id: 'milton-fiends',
    name: 'Milton Fiends',
    image: '/NPCs/Milton-Fiends.jpg',
    gender: 'male',
    info: {
      role: 'Male tiefling bandit captain (CN), Maximillian’s manservant',
      appearance: 'Milton is as handsome as the devil himself. He has raven-black hair, curved horns, and red eyes that reflect light in the dark. He wears a spotless servant’s livery with a cream-coloured frock coat, tailored trousers, and boots that are so immaculately polished you can see your own reflection in them. Despite his proper appearance, Milton has a chequered past. He used to be an urchin who worked as a street charlatan for many years in Northwind Gate. After double-crossing the wrong people, Milton was forced to flee the town. He stole a footman’s outfit and sought work as a servant in a different town to keep a low profile. Much to his surprise, Milton realised that he liked his new profession and never looked back.',
      gear: 'Milton wears Bracers of Defense under his frock coat. He also carries two slim daggers, a bag of caltrops, and a set of Thieves’ Tools hidden on his person.',
      trait: 'I am quiet, respectful, and polite. Deep down I worry that someone from my shabby past will recognise me.',
      ideal: 'Friendship. Blood doesn’t run thicker than water. (Neutral)',
      bond: 'Someone I once loved betrayed me, and I have sworn never to let my heart rule me again.',
      flaw: 'My trust, once lost, is gone forever.',
      sections: [
        { title: 'Information', body: 'Milton never spreads gossip and can keep a secret to his grave. Regardless of the circumstances, he would never speak ill about anyone from the D’arlington family. If asked if he has been at Silver Lodge before the murder, Milton acknowledges that after he had returned from the hunting expedition, he unpacked Maximillian’s luggage, made sure that everything was in order, and prepared refreshments for the evening. Milton also noticed that Morgen kept his musical instrument in a servants’ room at Silver Lodge. Milton believes that he must have ventured to Silver Lodge to leave his lute after the picnic, before the dancing began.' },
        { title: 'What he lies about', body: 'Milton smoothly lies about his background and claims that he grew up in a tiny, pretty village of no consequence to the world somewhere near Winterhold. He says that when he came of age, he left the village and found work as a footman.' },
        { title: 'What he hides', body: 'Milton is discretion himself, and he is reluctant to admit that Maximillian sometimes drinks too much. During the wedding day, Milton has been purposely slow to refill Maximillian’s glass. Later during the evening, Milton slipped a potion of antitoxin into Maximillian’s drink to prevent him from becoming exceedingly inebriated. With the exception of Maximillian, Milton is the only person who knows about the dire economic situation that the D’arlingtons are in. More than once, Milton has seen Maximillian brood over his ledgers late at night and heard him mumble about expenses in his restless sleep. Milton believes that Maximillian wants to marry Lÿsandrea because it would be financially beneficial for the D’arlington family. He believes that it has something to do with Silver Lodge, but he is unaware that Maximillian planned to start a mining operation in the area. Milton is also aware of Maximillian’s past affair with Galïanne, but he would never share this information with anyone. In addition, he is uneasy around Roslinda. Once Milton saw her cast a warlock ritual, and he actively avoids her company, especially since Roslinda once absentmindedly commented that he pronounces some words exactly like the children at the orphanage where she grew up.' },
        { title: 'Motive for murder', body: 'Milton isn’t involved in Maximillian’s death, but he does have a motive to want him dead, as Maximillian is one of the few who know about Milton’s shady background.' },
        { title: 'How to vex or woo him', body: 'Milton’s feelings are deeply buried, and he won’t be easily persuaded to give away the key to his heart. Therefore, earning his trust, love, or friendship might take some time. Milton is always respectful and polite. If he is offended, he hides his disdain behind his well-practised servant’s façade. Only rarely does he betray his emotions.' }
      ]
    }
  },
  {
    id: 'morgen-lavender',
    name: 'Morgen Lavender',
    image: '/NPCs/Morgen-Lavender.jpg',
    gender: 'male',
    info: {
      role: 'Male human bard (CN), uses the statistics of a spy',
      appearance: 'Morgen Lavender is a charming but somewhat sarcastic people-pleaser who loves music. Morgen has ruffled blond hair, a crooked smile, and winks frequently. He wears elegant travelling clothes and high boots, and he is especially fond of his velvet minstrel’s cloak. Morgen is an exceedingly talented musician and poet, with a vast repertoire of old stories, songs, and legends. He is self-taught and plays several instruments, including the lute, fiddle harp, and flute.',
      gear: 'Morgen wears leather armour, and carries a short sword and a hand crossbow.',
      trait: 'I am well aware of my winning smile, and I like being the centre of attention.',
      ideal: 'Creativity. My destiny is to compose a famous song that will travel the land long after I’m gone. (Neutral)',
      bond: 'One day, I will return rich and famous to the village from which I came.',
      flaw: 'My silver tongue has gotten me into trouble more times than I care to count.',
      sections: [
        { title: 'Information', body: 'As a travelling bard, Morgen has heard plenty of gossip and likes to embellish his stories further. Morgen knows Maximillian and the D’arlington family well. He is regularly invited to the family’s social gatherings to provide entertainment. As a natural magnet for gossip, Morgen knows that Maximillian and Galïanne were once considered a good match. He also knows that Milton has a secret, but he isn’t sure what it is. Morgen can also share information about the legend of Argentïs Falls.' },
        { title: 'What he lies about', body: 'Morgen frequently claims that he studied at the Royal Guild of Bards and Minstrels, but this isn’t true. Years ago, he travelled to Hammersong to apply for an apprenticeship with the guild. However, the day before the entrance exams, Morgen met several other applicants. Many were extremely talented and hailed from long lines of famous bards. Morgen couldn’t face the risk of failure and slipped away in the middle of the night. Morgen will also tell people – in confidence, of course! – that Maximillian tends to spread false gossip. Morgen wants people to suspect that Maximillian is prone to slander, so that if Maximillian tells anyone that Morgen never truly attended the Royal Guild of Bards and Minstrels, they won’t believe him.' },
        { title: 'What he hides', body: 'Some time ago, after too many drinks together, Maximillian stumbled upon the truth: Morgen has never really studied at the Royal Guild of Bards and Minstrels! Maximillian uses this to his advantage and no longer pays Morgen for his services. While Morgen can cope without payment, he is nervous that Maximillian will spread rumours about him, which could mean that many rich nobles would close their doors to Morgen.' },
        { title: 'Motive for murder', body: 'Morgen didn’t murder Maximillian, but he will nevertheless be relieved when he finds out that Maximillian is dead, since it prevents Morgen’s secrets from coming out.' },
        { title: 'How to vex or woo him', body: 'Morgen loves flirting and flattery. He falls in and out of love more often than other people change their socks. However, excellently performed music or moving poetry will genuinely win his heart. Since Morgen is rather self-centred, the easiest way to vex him is to speak with admiration about someone else. In addition, nosy questions or expressed doubts about his studies as a bard in Hammersong are met with cold displeasure.' }
      ]
    }
  },
  {
    id: 'dizzy-the-dragon',
    name: 'Dizzy the Dragon',
    image: '/NPCs/Dizzy-the-Dragon.jpg',
    gender: 'female',
    info: {
      role: 'Blue pseudodragon (NG)',
      appearance: 'Dizzy is the size of a cat and has long claws, a spiney tail, and slanted amber eyes. Dizzy lives at Silver Lodge and can often be found sleeping on a book on the highest shelf in the library. She is a decidedly curious creature and loves knowledge, comfortable tomes, and bards’ tales and legends. Dizzy was summoned by a mage over three centuries ago. She served as a familiar for many years until the mage grew rather mad and unpleasant. A group of heroes killed the power-hungry mage before he could carry out his sinister master plan, which included slaying or enslaving people in the region. When the mage’s library was looted, Dizzy hid among the books in the crates. When the previous owner of Silver Lodge bought some of the old mage’s books in an auction in Northwind Gate, Dizzy eventually ended up at Silver Lodge. Since then, Dizzy has lived a comfortable life in the library. She is displeased with the elven-themed renovations that have been carried out, but luckily Lÿsandrea’s mother decided that the old library, including all its dusty old books and many nooks and crannies, should be left intact.',
      gear: 'Dizzy doesn’t wear armour or weapons.',
      trait: 'I collect knowledge and lore, but can be quite haughty if anyone questions my expertise.',
      ideal: 'Curiosity. Never judge a book by its cover. (Neutral)',
      bond: 'I owe the previous owner of Silver Lodge a favour since they let me live in the old library.',
      flaw: 'Unless you share my love for knowledge, I shall secretly pity your lack of wit.',
      sections: [
        { title: 'Information', body: 'Dizzy doesn’t talk, but can make various hissing, scratching, and purring noises, as well as communicate using body language. If inclined, she can also use telepathy and send messages to other creatures in a soft, sibilant voice. Dizzy might decide to share some information with those she deems worthy – that is, those whom she finds interesting, or who offer her rare knowledge or are exceedingly good at flattery. Dizzy knows that Maximillian has been in the library on several occasions to study various books. However, she is reluctant to share exactly which type of books, as she doesn’t want to reveal the secret room.' },
        { title: 'What she lies about', body: 'Dizzy claims that she is perfectly content with her quiet life in the old library and would never dream of going on adventures, which sound both uncomfortable and highly risky. However, deep down in Dizzy’s little heart, she longs to see the world, and she would love to find a new person to bond with.' },
        { title: 'What she hides', body: 'Dizzy has seen Maximillian use the hidden door that leads to the secret library. She is generally unwilling to share this information, as she doesn’t want people to know about the secret room, where she has her lair. The secret study holds several rare books, including an old tome from The Seven Keys Library that contains information about mineral mapping in the North Star Region, which Maximillian seemed especially interested in. Dizzy is reluctant to gossip because she strongly believes in keeping her scaly snout out of other people’s business. Therefore, she doesn’t want to share that she has seen Sirbastien pour something into the wine decanter in Maximillian and Lÿsandrea’s bedroom. In addition, Dizzy saw Thalgion hide in the library while Maximillian argued with someone. Dizzy dislikes quarrels and left the room. She never saw whom Maximillian quarrelled with, but she thinks that it was with Lÿsandrea, as she and Galïanne have very similar voices.' },
        { title: 'A vital clue', body: 'If the characters get stuck and can’t solve the mystery, Dizzy can tell them about the Hidden library (Area 8) and explain that she has seen Maximillian read books in there.' },
        { title: 'Motive for murder', body: 'Dizzy doesn’t have a strong motive for killing Maximillian, even though he has replaced books in the library in a willy-nilly way and – worse! – once left an inexcusable wine stain in one of the books about mining.' },
        { title: 'How to vex or woo her', body: 'Like all dragons, Dizzy is exceptionally receptive to flattery, but what really wins her over is wit and knowledge. If a character shows that they have a wider understanding of the universe, she will become delighted and dazzled in equal measures. However, any teasing remark about her lilliputian size or unusual colour will instantly make Dizzy cross, and she will flex her wings and ready her poisonous stinger for attack! Optional: At the DM’s discretion, a character can adopt Dizzy as a familiar and let her accompany them on future adventures.' }
      ]
    }
  }
]
