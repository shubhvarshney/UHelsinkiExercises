const Person = (props) => {
    return (
        <div>
            {props.person.name} {props.person.number}
        </div>
    )
}

const Display = ({persons, search}) => {
  if (persons.length === 0) {
    return <div>No persons found!</div>
  }
  if (search.length > 0) {
    return (
      <div>
        {persons
          .filter(person => 
            person.name.toLowerCase().includes(search.toLowerCase())
          )
          .map(person => 
            <Person key={person.id} person={person} />
          )
        }
      </div>
    )
    
  } else {
      return (
        <div>
          {persons.map(person =>
            <Person key={person.id} person={person} />
          )}
        </div>
      )
  }
}

export default Display