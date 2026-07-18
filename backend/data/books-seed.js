/**
 * 110+ books across academic domains.
 * Covers are downloaded locally by `npm run download-covers` into
 * frontend/public/covers and stored as /covers/{isbn}.jpg|svg.
 */
const cover = (isbn) =>
  `/covers/${String(isbn).replace(/-/g, "")}.jpg`;

const books = [
  // Computer Science
  { title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "9780262033848", category: "Computer Science", quantity: 4 },
  { title: "The C Programming Language", author: "Brian W. Kernighan", isbn: "9780131103627", category: "Computer Science", quantity: 3 },
  { title: "Structure and Interpretation of Computer Programs", author: "Harold Abelson", isbn: "9780262510875", category: "Computer Science", quantity: 2 },
  { title: "Computer Networks", author: "Andrew S. Tanenbaum", isbn: "9780132126953", category: "Computer Science", quantity: 3 },
  { title: "Operating System Concepts", author: "Abraham Silberschatz", isbn: "9781118063330", category: "Computer Science", quantity: 3 },
  { title: "Compilers: Principles, Techniques, and Tools", author: "Alfred V. Aho", isbn: "9780321486813", category: "Computer Science", quantity: 2 },
  { title: "Introduction to the Theory of Computation", author: "Michael Sipser", isbn: "9781133187790", category: "Computer Science", quantity: 2 },
  { title: "Concrete Mathematics", author: "Ronald L. Graham", isbn: "9780201558029", category: "Computer Science", quantity: 2 },
  { title: "The Art of Computer Programming, Vol. 1", author: "Donald E. Knuth", isbn: "9780201896831", category: "Computer Science", quantity: 1 },
  { title: "Algorithms", author: "Robert Sedgewick", isbn: "9780321573513", category: "Computer Science", quantity: 3 },

  // Software Engineering
  { title: "Clean Code", author: "Robert C. Martin", isbn: "9780132350884", category: "Software Engineering", quantity: 5 },
  { title: "The Pragmatic Programmer", author: "David Thomas", isbn: "9780135957059", category: "Software Engineering", quantity: 4 },
  { title: "Design Patterns", author: "Erich Gamma", isbn: "9780201633610", category: "Software Engineering", quantity: 3 },
  { title: "Refactoring", author: "Martin Fowler", isbn: "9780134757599", category: "Software Engineering", quantity: 3 },
  { title: "Domain-Driven Design", author: "Eric Evans", isbn: "9780321125217", category: "Software Engineering", quantity: 2 },
  { title: "Continuous Delivery", author: "Jez Humble", isbn: "9780321601919", category: "Software Engineering", quantity: 2 },
  { title: "Working Effectively with Legacy Code", author: "Michael Feathers", isbn: "9780131177055", category: "Software Engineering", quantity: 2 },
  { title: "Code Complete", author: "Steve McConnell", isbn: "9780735619678", category: "Software Engineering", quantity: 3 },
  { title: "The Mythical Man-Month", author: "Frederick P. Brooks Jr.", isbn: "9780201835953", category: "Software Engineering", quantity: 2 },
  { title: "Agile Estimating and Planning", author: "Mike Cohn", isbn: "9780131479418", category: "Software Engineering", quantity: 2 },

  // Artificial Intelligence
  { title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", isbn: "9780134610993", category: "Artificial Intelligence", quantity: 4 },
  { title: "Deep Learning", author: "Ian Goodfellow", isbn: "9780262035613", category: "Artificial Intelligence", quantity: 3 },
  { title: "Pattern Recognition and Machine Learning", author: "Christopher M. Bishop", isbn: "9780387310732", category: "Artificial Intelligence", quantity: 2 },
  { title: "Hands-On Machine Learning", author: "Aurélien Géron", isbn: "9781098125974", category: "Artificial Intelligence", quantity: 4 },
  { title: "Reinforcement Learning", author: "Richard S. Sutton", isbn: "9780262039246", category: "Artificial Intelligence", quantity: 2 },
  { title: "Speech and Language Processing", author: "Daniel Jurafsky", isbn: "9780131873216", category: "Artificial Intelligence", quantity: 2 },
  { title: "Neural Networks and Deep Learning", author: "Charu C. Aggarwal", isbn: "9783319944623", category: "Artificial Intelligence", quantity: 2 },
  { title: "Machine Learning", author: "Tom M. Mitchell", isbn: "9780070428072", category: "Artificial Intelligence", quantity: 2 },

  // Data Science
  { title: "Python for Data Analysis", author: "Wes McKinney", isbn: "9781491957660", category: "Data Science", quantity: 4 },
  { title: "The Elements of Statistical Learning", author: "Trevor Hastie", isbn: "9780387848570", category: "Data Science", quantity: 2 },
  { title: "Data Science from Scratch", author: "Joel Grus", isbn: "9781492041139", category: "Data Science", quantity: 3 },
  { title: "Storytelling with Data", author: "Cole Nussbaumer Knaflic", isbn: "9781119002253", category: "Data Science", quantity: 3 },
  { title: "R for Data Science", author: "Hadley Wickham", isbn: "9781491910399", category: "Data Science", quantity: 3 },
  { title: "Practical Statistics for Data Scientists", author: "Peter Bruce", isbn: "9781492072942", category: "Data Science", quantity: 2 },

  // Database Systems
  { title: "Database System Concepts", author: "Abraham Silberschatz", isbn: "9780078022159", category: "Database Systems", quantity: 3 },
  { title: "Fundamentals of Database Systems", author: "Ramez Elmasri", isbn: "9780133970777", category: "Database Systems", quantity: 3 },
  { title: "Seven Databases in Seven Weeks", author: "Luc Perkins", isbn: "9781680502534", category: "Database Systems", quantity: 2 },
  { title: "SQL Performance Explained", author: "Markus Winand", isbn: "9783950307825", category: "Database Systems", quantity: 2 },
  { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", isbn: "9781449373320", category: "Database Systems", quantity: 4 },

  // Cybersecurity
  { title: "Cryptography and Network Security", author: "William Stallings", isbn: "9780134444284", category: "Cybersecurity", quantity: 3 },
  { title: "The Web Application Hacker's Handbook", author: "Dafydd Stuttard", isbn: "9781118026472", category: "Cybersecurity", quantity: 2 },
  { title: "Hacking: The Art of Exploitation", author: "Jon Erickson", isbn: "9781593271442", category: "Cybersecurity", quantity: 2 },
  { title: "Security Engineering", author: "Ross Anderson", isbn: "9781119642787", category: "Cybersecurity", quantity: 2 },
  { title: "Practical Malware Analysis", author: "Michael Sikorski", isbn: "9781593272906", category: "Cybersecurity", quantity: 2 },

  // Networking
  { title: "Computer Networking: A Top-Down Approach", author: "James F. Kurose", isbn: "9780133594140", category: "Networking", quantity: 3 },
  { title: "TCP/IP Illustrated, Volume 1", author: "W. Richard Stevens", isbn: "9780321336316", category: "Networking", quantity: 2 },
  { title: "Network Security Essentials", author: "William Stallings", isbn: "9780134527338", category: "Networking", quantity: 2 },
  { title: "BGP", author: "Iljitsch van Beijnum", isbn: "9780596004644", category: "Networking", quantity: 1 },

  // Mathematics
  { title: "Calculus", author: "James Stewart", isbn: "9781285740621", category: "Mathematics", quantity: 5 },
  { title: "Linear Algebra and Its Applications", author: "Gilbert Strang", isbn: "9780030105678", category: "Mathematics", quantity: 4 },
  { title: "Discrete Mathematics and Its Applications", author: "Kenneth H. Rosen", isbn: "9780073383095", category: "Mathematics", quantity: 4 },
  { title: "A First Course in Probability", author: "Sheldon Ross", isbn: "9780321794772", category: "Mathematics", quantity: 3 },
  { title: "Abstract Algebra", author: "David S. Dummit", isbn: "9780471433347", category: "Mathematics", quantity: 2 },
  { title: "Real Analysis", author: "H. L. Royden", isbn: "9780131437470", category: "Mathematics", quantity: 2 },
  { title: "Elementary Number Theory", author: "David M. Burton", isbn: "9780073383149", category: "Mathematics", quantity: 2 },
  { title: "Differential Equations", author: "Shepley L. Ross", isbn: "9780471008248", category: "Mathematics", quantity: 3 },

  // Physics
  { title: "University Physics with Modern Physics", author: "Hugh D. Young", isbn: "9780321973610", category: "Physics", quantity: 4 },
  { title: "Introduction to Electrodynamics", author: "David J. Griffiths", isbn: "9781108420419", category: "Physics", quantity: 3 },
  { title: "Introduction to Quantum Mechanics", author: "David J. Griffiths", isbn: "9781107189638", category: "Physics", quantity: 3 },
  { title: "Classical Mechanics", author: "John R. Taylor", isbn: "9781891389221", category: "Physics", quantity: 2 },
  { title: "Thermal Physics", author: "Daniel V. Schroeder", isbn: "9780201380279", category: "Physics", quantity: 2 },
  { title: "Optics", author: "Eugene Hecht", isbn: "9780133977226", category: "Physics", quantity: 2 },
  { title: "Feynman Lectures on Physics, Vol. 1", author: "Richard P. Feynman", isbn: "9780465024933", category: "Physics", quantity: 2 },

  // Chemistry
  { title: "Chemistry: The Central Science", author: "Theodore L. Brown", isbn: "9780134414232", category: "Chemistry", quantity: 4 },
  { title: "Organic Chemistry", author: "Paula Yurkanis Bruice", isbn: "9780134042282", category: "Chemistry", quantity: 3 },
  { title: "Physical Chemistry", author: "Peter Atkins", isbn: "9780199697403", category: "Chemistry", quantity: 2 },
  { title: "Inorganic Chemistry", author: "Catherine Housecroft", isbn: "9781292134147", category: "Chemistry", quantity: 2 },
  { title: "Analytical Chemistry", author: "Gary D. Christian", isbn: "9780470887578", category: "Chemistry", quantity: 2 },

  // Biology
  { title: "Campbell Biology", author: "Lisa A. Urry", isbn: "9780134093413", category: "Biology", quantity: 4 },
  { title: "Molecular Biology of the Cell", author: "Bruce Alberts", isbn: "9780815344322", category: "Biology", quantity: 3 },
  { title: "Genetics: Analysis and Principles", author: "Robert J. Brooker", isbn: "9781259616020", category: "Biology", quantity: 2 },
  { title: "Lehninger Principles of Biochemistry", author: "David L. Nelson", isbn: "9781464126116", category: "Biology", quantity: 3 },
  { title: "Microbiology: An Introduction", author: "Gerard J. Tortora", isbn: "9780134605180", category: "Biology", quantity: 2 },

  // Electrical Engineering
  { title: "Fundamentals of Electric Circuits", author: "Charles K. Alexander", isbn: "9780078028229", category: "Electrical Engineering", quantity: 4 },
  { title: "Microelectronic Circuits", author: "Adel S. Sedra", isbn: "9780199339136", category: "Electrical Engineering", quantity: 3 },
  { title: "Signals and Systems", author: "Alan V. Oppenheim", isbn: "9780138147570", category: "Electrical Engineering", quantity: 3 },
  { title: "Digital Design", author: "M. Morris Mano", isbn: "9780132774208", category: "Electrical Engineering", quantity: 3 },
  { title: "Power System Analysis", author: "John J. Grainger", isbn: "9780070612938", category: "Electrical Engineering", quantity: 2 },
  { title: "Control Systems Engineering", author: "Norman S. Nise", isbn: "9781118170519", category: "Electrical Engineering", quantity: 2 },

  // Civil Engineering
  { title: "Structural Analysis", author: "Russell C. Hibbeler", isbn: "9780133942842", category: "Civil Engineering", quantity: 3 },
  { title: "Fluid Mechanics", author: "Frank M. White", isbn: "9780073398273", category: "Civil Engineering", quantity: 3 },
  { title: "Principles of Geotechnical Engineering", author: "Braja M. Das", isbn: "9781305970939", category: "Civil Engineering", quantity: 2 },
  { title: "Transportation Engineering", author: "C. Jotin Khisty", isbn: "9780131573550", category: "Civil Engineering", quantity: 2 },
  { title: "Reinforced Concrete Design", author: "Chu-Kia Wang", isbn: "9780471262862", category: "Civil Engineering", quantity: 2 },

  // Mechanical Engineering
  { title: "Engineering Mechanics: Statics", author: "J. L. Meriam", isbn: "9781118807330", category: "Mechanical Engineering", quantity: 3 },
  { title: "Thermodynamics: An Engineering Approach", author: "Yunus A. Cengel", isbn: "9780073398174", category: "Mechanical Engineering", quantity: 4 },
  { title: "Shigley's Mechanical Engineering Design", author: "Richard G. Budynas", isbn: "9780073398209", category: "Mechanical Engineering", quantity: 3 },
  { title: "Fundamentals of Heat and Mass Transfer", author: "Theodore L. Bergman", isbn: "9780470501979", category: "Mechanical Engineering", quantity: 2 },
  { title: "Theory of Machines", author: "R. S. Khurmi", isbn: "9788121925242", category: "Mechanical Engineering", quantity: 2 },

  // Economics & Business
  { title: "Principles of Economics", author: "N. Gregory Mankiw", isbn: "9781305585126", category: "Economics", quantity: 4 },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", isbn: "9780374533557", category: "Economics", quantity: 3 },
  { title: "Capital in the Twenty-First Century", author: "Thomas Piketty", isbn: "9780674430006", category: "Economics", quantity: 2 },
  { title: "Good to Great", author: "Jim Collins", isbn: "9780066620992", category: "Business", quantity: 3 },
  { title: "The Lean Startup", author: "Eric Ries", isbn: "9780307887894", category: "Business", quantity: 3 },
  { title: "Competitive Strategy", author: "Michael E. Porter", isbn: "9780684841489", category: "Business", quantity: 2 },

  // History & Literature
  { title: "Sapiens", author: "Yuval Noah Harari", isbn: "9780062316097", category: "History", quantity: 4 },
  { title: "Guns, Germs, and Steel", author: "Jared Diamond", isbn: "9780393317558", category: "History", quantity: 2 },
  { title: "A People's History of the United States", author: "Howard Zinn", isbn: "9780062397348", category: "History", quantity: 2 },
  { title: "1984", author: "George Orwell", isbn: "9780451524935", category: "Literature", quantity: 5 },
  { title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "9780061120084", category: "Literature", quantity: 4 },
  { title: "Pride and Prejudice", author: "Jane Austen", isbn: "9780141439518", category: "Literature", quantity: 3 },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780743273565", category: "Literature", quantity: 4 },
  { title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", isbn: "9780060883287", category: "Literature", quantity: 2 },

  // Philosophy & Psychology
  { title: "Meditations", author: "Marcus Aurelius", isbn: "9780140449334", category: "Philosophy", quantity: 3 },
  { title: "The Republic", author: "Plato", isbn: "9780140455113", category: "Philosophy", quantity: 2 },
  { title: "Beyond Good and Evil", author: "Friedrich Nietzsche", isbn: "9780140449235", category: "Philosophy", quantity: 2 },
  { title: "Thinking in Systems", author: "Donella H. Meadows", isbn: "9781603580557", category: "Philosophy", quantity: 2 },
  { title: "Psychology", author: "David G. Myers", isbn: "9781464140815", category: "Psychology", quantity: 3 },
  { title: "Man's Search for Meaning", author: "Viktor E. Frankl", isbn: "9780807014271", category: "Psychology", quantity: 3 },
  { title: "Influence", author: "Robert B. Cialdini", isbn: "9780061241895", category: "Psychology", quantity: 3 },
  { title: "Flow", author: "Mihaly Csikszentmihalyi", isbn: "9780061339202", category: "Psychology", quantity: 2 },

  // Extra CS / Eng for 110+
  { title: "JavaScript: The Good Parts", author: "Douglas Crockford", isbn: "9780596517748", category: "Computer Science", quantity: 3 },
  { title: "You Don't Know JS Yet", author: "Kyle Simpson", isbn: "9781091210097", category: "Computer Science", quantity: 3 },
  { title: "Eloquent JavaScript", author: "Marijn Haverbeke", isbn: "9781593279509", category: "Computer Science", quantity: 3 },
  { title: "Python Crash Course", author: "Eric Matthes", isbn: "9781593279288", category: "Computer Science", quantity: 4 },
  { title: "Head First Design Patterns", author: "Eric Freeman", isbn: "9781492078005", category: "Software Engineering", quantity: 3 },
  { title: "Site Reliability Engineering", author: "Betsy Beyer", isbn: "9781491929124", category: "Software Engineering", quantity: 2 },
  { title: "The Phoenix Project", author: "Gene Kim", isbn: "9781942788294", category: "Business", quantity: 3 },
  { title: "Atomic Habits", author: "James Clear", isbn: "9780735211292", category: "Psychology", quantity: 4 },
  { title: "Educated", author: "Tara Westover", isbn: "9780399590504", category: "Literature", quantity: 3 },
  { title: "The Selfish Gene", author: "Richard Dawkins", isbn: "9780198788607", category: "Biology", quantity: 2 },
  { title: "A Brief History of Time", author: "Stephen Hawking", isbn: "9780553380163", category: "Physics", quantity: 3 },
  { title: "The Gene", author: "Siddhartha Mukherjee", isbn: "9781476733524", category: "Biology", quantity: 2 },
  { title: "Surely You're Joking, Mr. Feynman!", author: "Richard P. Feynman", isbn: "9780393316047", category: "Physics", quantity: 2 },
  { title: "Zero to One", author: "Peter Thiel", isbn: "9780804139298", category: "Business", quantity: 3 },
  { title: "The Intelligent Investor", author: "Benjamin Graham", isbn: "9780060555665", category: "Economics", quantity: 2 },
];

module.exports = {
  books: books.map((b) => ({
    ...b,
    cover_url: cover(b.isbn),
    is_available: b.quantity > 0,
  })),
};
