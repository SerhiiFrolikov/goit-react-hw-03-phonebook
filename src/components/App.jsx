import { Component } from 'react';
import { nanoid } from 'nanoid';
import { ContactForm } from './contactform/ContactForm';
import { ContactList } from './contactlist/ContactList';
import { Filter } from './filter/Filter';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const currentContacts = localStorage.getItem('contacts');
    const contacts = JSON.parse(currentContacts);
    if (contacts) {
      this.setState({ contacts });
    }
  }

  componentDidUpdate(_, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  findNameInput = event => {
    this.setState({
      filter: event.currentTarget.value,
    });
  };

  handleAddContacts = ({ name, number }) => {
    const { contacts } = this.state;
    const addedName = contacts.some(
      contact => contact.name.toLowerCase() === name.toLowerCase()
    );

    if (addedName) {
      return alert(`${name} is already in contacts`);
    }

    this.setState(prevState => ({
      contacts: [...prevState.contacts, { name, id: nanoid(8), number }],
    }));
  };

  handleContactsDelete = id => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== id),
    }));
  };

  getVisibleContacts = () => {
    return this.state.contacts.filter(contact =>
      contact.name.toLowerCase().includes(this.state.filter.toLowerCase())
    );
  };
  render() {
    const { contacts, filter } = this.state;
    const renderNames = this.getVisibleContacts();
    return (
      <>
        <h1>Phonebook</h1>
        <ContactForm handleAddContacts={this.handleAddContacts} />
        <h2>Contacts</h2>
        <Filter filter={filter} findName={this.findNameInput} />
        {!!contacts.length && (
          <ContactList
            contacts={renderNames}
            handleContactsDelete={this.handleContactsDelete}
          />
        )}
      </>
    );
  }
}
export default App;
