import React from 'react'
import './App.scss'
import logo from './assets/logo.png' 
import clock from './assets/clock.svg' 
import change from './assets/switch.svg' 
import mail from './assets/envelope.svg' 
import mexico from './assets/mexico.png' 

class App extends React.Component {
  constructor() {
    super();
    this.state = { 
        data: [],
        origin:'',
        destination:'',
        date:'',
        dataVuelos:[],
        radio:'',
        numberFlight:'',
        flag:false
    };
  }

  componentDidMount() {
    let today = new Date();
    this.setState({date:this.dateFormat(today), radio:'destination'}) 
    
    fetch('https://www.aeromexico.com/cms/api/v1/airports?language=es&status=1')
    .then(response=>response.json())
    .then(data => this.setState({
        data: data.airports
    }))
  }

  dateFormat(today) {
    let day = today.getDate()
    let month = today.getMonth() + 1
    let year = today.getFullYear()
    if(month < 10){
      month = `0${month}`
    }
    if(day < 10){
      day = `0${day}`
    }
    return  `${year}-${month}-${day}`
  }

  send(){
   
    let params = `?store=mx&pos=WEB&flight=${this.state.numberFlight}&date=${this.state.date}&origin=${this.state.origin}&destination=${this.state.destination}`
    fetch(`https://www.aeromexico.com/api/v1/checkin/flight-status${params}`)
    .then(response=>response.json())
    .then(data => this.setState({
        dataVuelos: data._collection,
        flag:true
    }))
    
  }


  handleChangeOrigin = (event) => {
    this.setState({ origin: event.target.value })
  }

  handleChangeDestination = (event) => {
    this.setState({ destination: event.target.value })
  }

  handleChangeDate = (event) => {
    this.setState({ date: event.target.value })
  }

  handleChangeRadio = (event) => {
    this.setState({radio: event.target.value })
    event.target.value === 'numberFlight' ? this.setState({origin:'', destination:''}) : this.setState({numberFlight:''})
  }

  handleChangeNubmerFlight = (event) => {
    this.setState({numberFlight: event.target.value})
  }

  handleChangeSwitch(){
    this.setState({origin:this.state.destination, destination:this.state.origin})  
  } 
  
  render(){

    const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
    
    let today = new Date();
    let yesterday = new Date(today.getTime() - 24*60*60*1000)
    let tomorrow = new Date(today.getTime() + 24*60*60*1000);

    const labelYesterday = `${yesterday.getDate()} de ${months[yesterday.getMonth()]}`
    const labelToday = `${today.getDate()} de ${months[today.getMonth()]}`
    const labelTomorrow = `${tomorrow.getDate()} de ${months[tomorrow.getMonth()]}`

    const yesterdayFormat = this.dateFormat(yesterday)
    const todayFormat = this.dateFormat(today)
    const tomorrowFormat = this.dateFormat(tomorrow)


    let fieldsAux = []
    let fields = [] 
    if (this.state.data.length > 0) {
       this.state.data.map(data =>{
         return fieldsAux.push({code: data.airport.code , city: data.airport.city})
      })
      fieldsAux.sort( (a, b) => (a.city > b.city) ? 1 : -1)
      fieldsAux.map( (data,index)  =>{
         return fields.push(<option key={index} value={data.code}>{data.city} {data.code}</option>)
       })
    }
    
    let fligths = []
    let lista = []
    if (this.state.dataVuelos.length > 0) {
      this.state.dataVuelos.map( data => {
        let status = ''
        switch (data._collection[0].status) {
          case 'ON_TIME': 
            status = 'A tiempo' 
            break;
          case 'ARRIVED': 
            status = 'LLegó' 
            break;
          default:
            status = 'En vuelo'  
            break;
        }
        let obj = {
          arrivalGate: data._collection[0].arrivalGate,
          arrivalTerminal: data._collection[0].arrivalTerminal,
          boardingGate: data._collection[0].boardingGate,
          boardingTerminal: data._collection[0].boardingTerminal,
          estimatedArrivalTime: data._collection[0].estimatedArrivalTime.substring(11,16),
          estimatedDepartureTime: data._collection[0].estimatedDepartureTime.substring(11,16),
          status,
          marketingCarrier: data._collection[0].segment.marketingCarrier,
          marketingFlightCode: data._collection[0].segment.marketingFlightCode,
          arrivalAirport: data._collection[0].segment.arrivalAirport,
          departureAirport: data._collection[0].segment.departureAirport,
        }
        return fligths.push(obj)
      })

      
      fligths.map ((data, index)=>{
        return lista.push(
          <div className = "fligths" key={index}>
            
            <div className="textLarge">
              <strong>{`${data.marketingCarrier} ${data.marketingFlightCode}`}</strong>
            </div>
            <div className="textLarge">{data.status}</div>
            <div>
              <span className="textLarge">{data.departureAirport}</span>
              <br/>
              <span className="textSmall">Terminal {data.boardingTerminal}</span>
              <br/>
              <span className="textSmall">Sala {data.boardingGate}</span>
            </div>
            <div className="textLarge">
              {data.estimatedDepartureTime}
            </div>
            <div className="separatorContainer">
                <div className="circleL"></div>
                <div className="line"></div>
                <div className="circleR"></div>
            </div>
            <div className="textLarge">
              {data.estimatedArrivalTime}
            </div>
            <div>
              <span className="textLarge">{data.arrivalAirport}</span>
              <br/>
              <span className="textSmall">Terminal {data.arrivalTerminal}</span> 
              <br/>
              <span className="textSmall">Sala {data.arrivalGate}</span>
            </div>
          </div>
        )
      })
    }
    
    return (
      <div className="App">
        <header className="App-header">
          <picture className="logo">
            <img 
						className="logo__image"
						src={logo} 
						alt="Foto de perfil"/>
          </picture>
          <nav className="menu">
            <ul>
              <li>Reserva</li>
              <li>Tu viaje</li>
              <li>Check-in</li>
              <li>Salud e higiene</li>
              <li>Club Premier</li>
            </ul>
          </nav>

          <div className="menuRight">
            <ul>
              <li>Promociones</li>
              <li>Rastrea un vuelo</li>
              <li>Destinos</li>
              <li>Más</li>
            </ul>
          </div>

          <div className="menuIcons">
            <picture className="logoMenu">
              <img 
              className="logo__mail"
              src={mail} 
              alt="Foto de perfil"/>
            </picture>

            <picture className="logoMenu">
              <img 
              className="logo__mail"
              src={mexico} 
              alt="Foto de perfil"/>
            </picture>

            <div className="login">
              Iniciar sesión
            </div>

          </div>

        </header>

        <div className="mainContainer">
            <div className="title">
              <picture>
                <img 
                  className="title__image"
                  src={clock} 
                  alt="Foto de perfil"/>
              </picture>
              <div>
                Rastrea tu vuelo
              </div>
            </div>

            <div className="form">

              <div className="radioButtons">
                <div className="radioRow">
                  <input className="radio" type="radio" name="option" value="destination" onClick={this.handleChangeRadio} defaultChecked/> 
                  <div>Destino</div>
                </div>
                <div className="radioRow">
                  <input className="radio" type="radio" name="option" value="numberFlight" onClick={this.handleChangeRadio}/> 
                  <div>Número de vuelo</div>
                </div>
              </div>

              { this.state.radio === 'destination' ?
                <div className="destination">
      
                  <div className="inputContainer">
                    <div> Origen </div>
                    <select className="input" value={this.state.origin} onChange={this.handleChangeOrigin} name="origin">
                      <option value=""></option>
                      {fields}
                    </select>
                  </div> 

                  <div className="switch" onClick={()=>this.handleChangeSwitch()}>
                    <img 
                      className="title__switch"
                      src={change} 
                      alt="Foto de perfil"/>
                  </div>

                  <div className="inputContainer">
                  <div>Destino</div>
                  <select className="input"  value={this.state.destination} onChange={this.handleChangeDestination} name="destination">
                    <option value=""></option>
                    {fields}
                  </select>
                </div>
                
                </div>
                :
                <div className="numberFligth">

                    <div className="inputContainer">
                      <div> Número de vuelo </div>
                        <input 
                          className = "input" 
                          type="text" 
                          value={this.state.numberFlight} 
                          onChange={this.handleChangeNubmerFlight} 
                          maxLength = "8"/>
                    </div> 

                </div>
              }

              <div className="inputContainerDate">
                Fecha de salida
                <select className="date" value={this.state.date} onChange={this.handleChangeDate} name="date">
                  <option value={yesterdayFormat}>{labelYesterday}</option>
                  <option value={todayFormat}>{labelToday}</option>
                  <option value={tomorrowFormat}>{labelTomorrow}</option>
                </select>
              </div>
              
              <div 
                className={
                  this.state.radio === 'destination' && this.state.origin !== '' && this.state.destination !== '' ?
                  "button"
                  :this.state.radio === 'numberFlight' && this.state.numberFlight !== '' ?
                  "button"
                  :"buttonDisabled"
                } 
                onClick={()=>this.send()}
              >
                  BUSCAR
              </div>
              
            </div>
            {this.state.dataVuelos.length > 0 ? 
                <div className="result">
                    <div className="headers">
                      <div>Numero de vuelo</div>
                      <div>Estado</div>
                      <div>Origen</div>
                      <div>Hora de salida</div>
                      <div></div>
                      <div>Hora de llegada</div>
                      <div>Destino</div>
                    </div>
                  {
                      lista
                  }
                
                </div>
                : 
                  this.state.flag ?
                  <div className="noData">
                    <div className="noDataLineOne">No hay vuelos disponibles</div>
                    <div className="noDataLineTwo">Por favor intenta de nuevo</div>
                  </div>
                  :null 
              }
            
          </div>

        </div>

        
    )
  }
}

export default App;
