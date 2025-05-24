const Person = (props) => {
    return (
        <div key={props.person.name}>
            {props.person.name} {props.person.number}
        </div>
    )
}

const Display = ({persons, search}) => {
  if (search.length > 0) {
    return (
      <div>
        {persons
          .filter(person => 
            person.name.toLowerCase().includes(search.toLowerCase())
          )
          .map(person => 
            <Person key={person.name} person={person} />
          )
        }
      </div>
    )
    
  } else {
      return (
        <div>
          {persons.map(person =>
            <Person key={person.name} person={person} />
          )}
        </div>
      )
  }
}

export default Display