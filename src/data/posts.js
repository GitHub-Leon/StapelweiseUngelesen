export const posts = [
  {
    id: '1',
    type: 'rezension', // review -> rezension
    title: 'Die Mitternachtsbibliothek',
    author: 'Matt Haig',
    date: '2023-10-15',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800', 
    summary: ' Ein Roman über all die Leben, die man hätte leben können.',
    content: `
      <p>Zwischen Leben und Tod gibt es eine Bibliothek, und in dieser Bibliothek reichen die Regale bis in die Unendlichkeit. Jedes Buch bietet die Chance, ein anderes Leben auszuprobieren. Zu sehen, wie die Dinge gelaufen wären, hätte man andere Entscheidungen getroffen... Würdest du etwas anders machen, wenn du die Chance hättest, deine Reue ungeschehen zu machen?</p>
      <h3>Was mir gefallen hat</h3>
      <ul>
        <li>Das Konzept ist unglaublich einzigartig und regt zum Nachdenken an.</li>
        <li>Die Charakterentwicklung von Nora wirkte sehr authentisch.</li>
      </ul>
      <h3>Was mir nicht gefallen hat</h3>
      <ul>
        <li>Einige der alternativen Leben fühlten sich etwas überhastet an.</li>
      </ul>
    `,
    rating: 4.5,
    likes: 120,
    dislikes: 5
  },
  {
    id: '2',
    type: 'rezension',
    title: 'Der Astronaut',
    author: 'Andy Weir',
    date: '2023-09-28',
    coverImage: 'https://images.unsplash.com/photo-1581822261290-991b38693d1b?q=80&w=2070',
    summary: 'Ein einsamer Astronaut muss die Erde vor einer Katastrophe retten.',
    content: `
      <p>Ryland Grace ist der einzige Überlebende einer verzweifelten Mission – und wenn er scheitert, werden die Menschheit und die Erde selbst untergehen. Nur weiß er das im Moment noch nicht. Er kann sich nicht einmal an seinen eigenen Namen erinnern, geschweige denn an die Art seines Auftrags oder wie er ihn erfüllen soll.</p>
      <h3>Was mir gefallen hat</h3>
      <ul>
        <li>Rocky! Bester Charakter überhaupt.</li>
        <li>Die Wissenschaft wirkte zugänglich, aber dennoch clever.</li>
      </ul>
    `,
    rating: 5,
    likes: 250,
    dislikes: 2
  },
  {
    id: '3',
    type: 'gedanken', // thought -> gedanken
    title: 'Warum ich physische Bücher bevorzuge',
    date: '2023-09-05',
    coverImage: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&q=80&w=800',
    summary: 'Es hat etwas Besonderes, Papier zu riechen, das Digitales einfach nicht ersetzen kann.',
    content: `
      <p>In einem Zeitalter, in dem alles digital wird, stelle ich fest, dass ich mehr denn je an physischen Büchern hänge. Das haptische Erlebnis beim Umblättern, der Geruch des Papiers, das Gewicht des Buches in meiner Hand – all das trägt zum Leseerlebnis bei.</p>
      <p>Versteh mich nicht falsch, E-Reader sind praktisch. Aber ihnen fehlt die Seele eines echten Buches.</p>
    `,
    rating: null,
    likes: 89,
    dislikes: 12
  },
  {
    id: '4',
    type: 'rezension',
    title: 'Yellowface',
    author: 'R.F. Kuang',
    date: '2023-08-12',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    summary: 'Ein satirischer Thriller über die Verlagsbranche.',
    content: `
      <p>June Hayward und Athena Liu sollten eigentlich Zwillingsstars sein: gleicher Jahrgang in Yale, gleiches Debütjahr. Aber Athena ist ein Liebling der Literaturszene, während June nicht einmal als Taschenbuch veröffentlicht wurde.</p>
      <p>Als June Athenas Tod bei einem bizarren Unfall miterlebt, handelt sie impulsiv: Sie stiehlt Athenas gerade fertiggestelltes Meisterwerk, einen experimentellen Roman über die unbesungenen Beiträge chinesischer Arbeiter während des Ersten Weltkriegs.</p>
    `,
    rating: 4,
    likes: 150,
    dislikes: 10
  }
];
