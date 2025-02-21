// Necessary Imports (you will need to use this)
const { Student } = require('./Student')
const fs = require('fs').promises;
/**
 * Node Class (GIVEN, you will need to use this)
 */
class Node {
  // Public Fields
  data               // Student
  next               // Object
  /**
   * REQUIRES:  The fields specified above
   * EFFECTS:   Creates a new Node instance
   * RETURNS:   None
   */
  constructor(data, next = null) {
    this.data = data;
    this.next = next
  }
}

/**
 * Create LinkedList Class (for student management)
 * The class should have the public fields:
 * - head, tail, length
 */
class LinkedList {
  // Public Fields
  head              // Object
  tail              // Object
  length            // Number representing size of LinkedList

  /**
   * REQUIRES:  None
   * EFFECTS:   Creates a new LinkedList instance (empty)
   * RETURNS:   None
   */
  constructor() {
    // TODO
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * REQUIRES:  A new student (Student)
   * EFFECTS:   Adds a Student to the end of the LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about adding to the 'end' of the LinkedList (Hint: tail)
   */
  addStudent(newStudent) {
    // TODO
    let node = new Node(newStudent);
    if (!this.head){
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
      this.length++;
  }

  /**
   * REQUIRES:  email(String)
   * EFFECTS:   Removes a student by email (assume unique)
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about how removal might update head or tail
   */
  removeStudent(email) {
    // TODO
    if(!this.head){
      return;
    }
    
    let current = this.head;
    let previous;

    if(current.data.getEmail() === email){
      this.head = current.next;
    }else{
      while(current && current.data.getEmail() !== email){
        previous = current;
        current = current.next;
      }
      if(!current){
        return;
      }

      previous.next = current.next;

      if (current === this.tail){
        this.tail = previous;
      }
    }
    this.length--;
  }

  /**
   * REQUIRES:  email (String)
   * EFFECTS:   None
   * RETURNS:   The Student or -1 if not found
   */
  findStudent(email) {
    // TODO
    let current = this.head;
    while (current){
      if (current.data.getEmail() === email){
        return current.data.getString();
      }
      current = current.next;
    }
    
    return -1

  }

  /**
   * REQUIRES:  None
   * EFFECTS:   Clears all students from the Linked List
   * RETURNS:   None
   */
  clearStudents() {
    // TODO
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   LinkedList as a String for console.log in caller
   * CONSIDERATIONS:
   *  - Let's assume you have a LinkedList with two people
   *  - Output should appear as: "JohnDoe, JaneDoe"
   */
  displayStudents() {
    // TODO
    let current = this.head;
    let names = []; 

    while (current) {
        names.push(current.data.getName());
        current = current.next;
    }

    console.log(names.join(", "));
    return "";
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   A sorted array of students by name
   */
  #sortStudentsByName() {
    // TODO
    if (!this.head || !this.head.next) {
      return []
    }
    let studentsArray = [];
    let current = this.head;
    while (current) {
        studentsArray.push(current.data);
        current = current.next;
    }
    studentsArray.sort((a, b) => {
      const nameA = a.getName().toUpperCase(); 
      const nameB = b.getName().toUpperCase(); 
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    })
  
    return studentsArray;

    //return [];
  }


    
  

  /**
   * REQUIRES:  specialization (String)
   * EFFECTS:   None
   * RETURNS:   An array of students matching the specialization, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterBySpecialization(specialization) {
    // TODO
    let sortedStudents = this.#sortStudentsByName();
    let filteredStudents = [];
    
    for (let i = 0; i < sortedStudents.length; i++) {
        let student = sortedStudents[i]; 

        if (student.getSpecialization() === specialization) {
            filteredStudents.push(student); 
        }
    }
    return filteredStudents;
  }


    


  /**
   * REQUIRES:  minAge (Number)
   * EFFECTS:   None
   * RETURNS:   An array of students who are at least minAge, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterByMinYear(minYear) {
    // TODO
    let sortedStudents = this.#sortStudentsByName();
    let filteredStudents = [];

    for (let i = 0; i < sortedStudents.length; i++) {
        let student = sortedStudents[i]; 

        if (student.getYear() >= minYear) {
            filteredStudents.push(student); 
        }
    }
    return filteredStudents;
   // return [];
  }

  /**
   * REQUIRES:  A valid file name (String)
   * EFFECTS:   Writes the LinkedList to a JSON file with the specified file name
   * RETURNS:   None
   */
  async saveToJson(fileName) {
    // TODO
    try {
      let current = this.head;
      let studentsArray = [];
  
      while (current) {
        studentsArray.push({
          name: current.data.getName(),
          year: current.data.getYear(),
          email: current.data.getEmail(),
          specialization: current.data.getSpecialization(),
        });
        current = current.next;
      }
  
      const jsonData = JSON.stringify(studentsArray, null, 2);
      await fs.writeFile(fileName, jsonData, 'utf8');
    } catch (error) {
      console.error("Error saving to JSON:", error);
    }
  }

  /**
   * REQUIRES:  A valid file name (String) that exists
   * EFFECTS:   Loads data from the specified fileName, overwrites existing LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   *  - Use clearStudents() to perform overwriting
   */
  async loadFromJSON(fileName) {
    // TODO
    try {
      // Read the JSON data from the file
      const data = await fs.readFile(fileName, 'utf8');
  
      // Parse the JSON data
      const studentsArray = JSON.parse(data);
  
      // Clear the current LinkedList before loading new students
      this.clearStudents()
  
      // Add each student from JSON to the LinkedList
      studentsArray.forEach(studentData => {
        const student = new Student(studentData.name, studentData.year, studentData.email, studentData.specialization);
        this.addStudent(student);
      });
  
      console.log(`Loaded ${studentsArray.length} students from ${fileName}`);
    } catch (error) {
      console.error("Error loading from JSON:", error);
    }
  }
  

}

module.exports = { LinkedList }
