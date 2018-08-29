import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


class TaskList extends Component {


  render() {

    let taskList = this.props.tasks.map((item, i) => {

      let doneClass = item.done ? 'task-done' : '';
      let buttonText = ! item.done ? 'Listo' : 'No Listo'; 

      return (
        <li className={doneClass} key={item.id}>
          <span className="number">
            {i+1}
          </span>
          <span className="name">
            {item.name} 
          </span>
          <button
          className="toggle-done-button"
          onClick={ () => this.props.onFinish(item) }>
            {buttonText}
          </button>
          <button
          className="remove-button"
          onClick={ () => this.props.onDelete(item) }>
            Eliminar
          </button>
          
        </li>
      )
    })
    
    return (
      <ul className="to-do-list">

        { taskList }

      </ul>
    )

  }

}


class NewTaskForm extends Component {

  constructor( props ) {

    super(props)

    this.state = {
      value: ''
    }

  }

  handleChange( event ) {
    
    let newValue = event.target.value;

    this.setState({
      value: newValue
    })

  }

  handleSubmit( e ) {
    
    let formValue = this.state.value;

    this.setState({
      value: ''
    });

    let newTask = {
      // generar id random con muy poca probabilidad de repetirse
      id: 1 + Math.random(),
      name: formValue,
      done: false,
    }

    this.props.onAdd( newTask ) 

    e.preventDefault();
    
  }

  render() {
    return (
      <form onSubmit={ (e) => this.handleSubmit(e) }>
          
          <input
          type="text"
          value={this.state.value}
          onChange={ (e) => this.handleChange(e) }
          maxLength={ 25 }
          placeholder="Add a task here..."
          />

          <input
          type="submit"
          value="Añadir"
          />

      </form>
    )
  }

}

class App extends Component {

  state = {
    tasks: []
  }


  componentDidMount() {

    this.fillStateWithLocalStorage()

    window.addEventListener(
      'beforeunload',
      this.saveStateToLocalStorage.bind( this )
    )

  }

  componentWillUnmount() {
    window.removeEventListener(
      'beforeunload',
      this.saveStateToLocalStorage.bind(this)
    )

    this.saveStateToLocalStorage.bind(this)
  }

  saveStateToLocalStorage() {

    for( let key in this.state ) {
      localStorage.setItem( key, JSON.stringify(this.state[key]) )
    }

  }

  fillStateWithLocalStorage() {

    // iterar por todos los elementos almacenados en estado
    for( let key in this.state ) {
      // revisar si su clave existe en localStorage
      if( localStorage.hasOwnProperty( key ) ) {
        // obtener el valor almacenado con esa clave
        let value = localStorage.getItem( key )

        // 'parsear' el dato 'string' de localStorage con JSON
        try {

          value = JSON.parse( value )
          this.setState({ [key]: value })

        } catch (e) {
          // manejar strings vacíos
          this.setState({ [key]: value })

        }

      }

    }

  }

  onAddHandler( task ) {

    // crear una copia del arreglo usando operador spread (propagacion)
    let taskList = [...this.state.tasks]

    taskList.push( task )

    this.setState({
      tasks: taskList
    })

  }

  onFinishHandler( task ) {

    let taskList = [...this.state.tasks]

    // usar llaves {} para que sirva if
    taskList.map( item => {
      if( item.id === task.id ) {
        item.done = ! item.done
      }
    });

    this.setState({
      tasks: taskList
    })

  }

  onDeleteHandler( task ) {

    let taskList = [...this.state.tasks]

    // filtrar arreglo y dejar solo aquellos que no tienen el id del task-parametro
    taskList = taskList.filter( item => item.id !== task.id )

    this.setState({
      tasks: taskList
    })

  }

  render() {

    let totalDone;

    // dos alternativas para calcular no. de elementos terminados
    totalDone = this.state.tasks.filter( item => item.done ).length
    totalDone = this.state.tasks.reduce( (previousValue,currentItem) => currentItem.done ? previousValue+1 : previousValue, 0 )
    
    return (
      <div className="To-Do-List">

        <h1>
          To Do List
        </h1>

        <p>*Se almacenan en localStorage. Prueba recargando tu ventana despues de añadir algunas tareas.</p>


        <NewTaskForm onAdd={ (task) => this.onAddHandler(task) }/>

        <div className="progress-indicator">
          { totalDone } / { this.state.tasks.length }
        </div>

        <TaskList
        tasks={ this.state.tasks }
        onFinish={ (task) => this.onFinishHandler( task ) }
        onDelete={ (task) => this.onDeleteHandler( task ) }
        />

      </div>
    );
  }
}

export default App;
