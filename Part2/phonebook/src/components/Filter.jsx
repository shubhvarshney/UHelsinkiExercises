const Filter = (props) => {
  return (
    <div>
      filter shown with <input value={props.search} onChange={props.handleSearch} />
    </div>
  )
}

export default Filter