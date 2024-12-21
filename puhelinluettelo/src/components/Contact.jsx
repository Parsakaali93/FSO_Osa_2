
export default function Contact({contact, deleteContact}) {
  return (
    <div className="personInfo"><p>{contact.name}</p><p>{contact.number}</p><button onClick={() => deleteContact(contact.id)}>Delete</button></div>
  )
}
