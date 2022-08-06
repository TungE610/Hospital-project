import {React, Fragment, useState, useEffect, useContext}from "react";
import styles from "./Appointment.module.css"
import ContactRow from "../../components/contactRow/ContactRow";
import Navbar from "../../components/navbar/Navbar";
import { Table, Tag, Input,Select,Button, Tooltip, Space,Modal,notification } from 'antd'
import { useNavigate } from "react-router-dom";
import RegisterModal from "../../components/registerModal/RegisterModal";
import { SearchOutlined, EditTwoTone, DeleteTwoTone, SendOutlined } from '@ant-design/icons'
import LogginContext from '../../components/accountBox/LogginContext'
import BillModal from "../../components/bill/BillModal";
import { copyFileSync } from "fs";

const Appointments = (props) => {
  const [appointmentData, setAppointmentData] = useState([])
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isBillModalVisible, setIsBillModalVisible] = useState(false)
	const [loading, setLoading] = useState(false);
	const [searchType, setSearchType] = useState('appointment_id')
	const [searchValue, setSearchValue] = useState('')
	const [loginData, setLoggedIn] = useContext(LogginContext)
	const [selectedAppointmentId, setSelectedAppointmentId] = useState('')
	const [selectedPatientId, setSelectedPatientId] = useState('')
	const [status_of_insurance, setStatus_of_insurance] = useState(false)
	const [doctorStatus, setDoctorStatus] = useState(false)
	const [typeSee, setTypeSee] = useState(true)
	const navigate = useNavigate();
	const { Option } = Select;

	const toggleModalHandler = (state) => {
		setIsModalVisible(state)
  }
  const getAppointments = async () => {
		setLoading(true)
			try {
				const response = await fetch("https://hospital-project-api.herokuapp.com/api/appointments")
				const jsonData = await response.json()
				setAppointmentData(jsonData)
				setLoading(false)
			} catch(error){
				console.log(error.message)
			}
		}
		useEffect(() => {
			getAppointments()
			setDoctorStatus(!appointmentData.map(element => element.doctor_id).includes(loginData.doctor_id))
	}, [])
	useEffect(() => {
		searchHandler()
	}, [searchValue])
	const editAppointmentHandler = (id) => {
			navigate(`/Appointments/Edit/${id}`)
	}
	console.log(appointmentData)
const sendAppointmentInfo = (id) => {

}
const successNotification = () => {
	notification["success"]({
		message: 'SUCCESSFULL',
		description:
			`You have just successfully make new appointment.!!`,
	});
};
console.log("doctor status : ", doctorStatus)
const saveNotification = () => {
	notification["success"]({
		message: 'SUCCESSFULL',
		description:
			`Successfully change!!`,
	});
};
	const columns = [
		{
			title : "Appointment ID",
			key : "appointment_id",
			dataIndex : "appointment_id",
			align : "center"
		},
		{
			title : "Start Time",
			key : "start_time",
			dataIndex : "start_time",
			align : "center"
		},
		{
			title : "Expected Time",
			key : "expected_time",
			dataIndex : "expected_time",
			align : "center"
		},
		{
			title : "Diagnosis",
			key : "diagnosis",
			dataIndex : "diagnosis",
			align : "center",			
		},
		{
			title : "Specialty",
			key : "specialty",
			dataIndex : "specialty",
			align : "center"
		},
		{
			title : "Room_id",
			key : "room_id",
			dataIndex : "room_id",
			align : "center"
		},
		{
			title : "Doctor Id",
			key : 'doctor_id',
			dataIndex : 'doctor_id',
			align : 'center'
		},
		{
			title : "Patient Id",
			key : 'patient_id',
			dataIndex : 'patient_id',
			align : 'center'
		},   {
      title: 'Action',
      key: 'action',
      width: '10%',
			align : "center",
      render: (_text, record) => (loginData.role === 'doctor' && loginData.doctor_id === record.doctor_id) && !record.end_time ? (
        <Space size="middle">
          <EditTwoTone
            id={record.appointment_id}
            onClick={(event) => {
							console.log(record.appointment_id)
							event.stopPropagation()
              editAppointmentHandler(record.appointment_id)
            }}
          />

					<SendOutlined
						style={{color: "#4E89FF"}}
						twoToneColor="#eb2f96"
						id={record.appointment_id}
						onClick={(event) => {
								event.stopPropagation()
								setSelectedAppointmentId(record.appointment_id)
								setSelectedPatientId(record.patient_id)
								const status_insurance = appointmentData.find(element => element.patient_id === record.patient_id).status_of_insurance
								setStatus_of_insurance(status_insurance)
								setIsBillModalVisible(true)
						}}
									/>
        </Space>
      ) : 						
			<Tag color="red">
					Not allow
			</Tag>
    },
	]
	console.log("status : ", status_of_insurance)
	const searchTypeHandler = (value) => {
    setSearchType(value)
	}

  const getSearchData = (e) => {
		setSearchValue(e.target.value)
	}
  const toggleBillModalHandler = (state) => {
		setIsBillModalVisible(state)
	}
  const searchHandler = async () => {
		  
			if(searchType === 'appointment_id') {
				setLoading(true)
				try {
					let response 
					if(searchValue.trim().length > 0){
						 response = await fetch(`https://hospital-project-api.herokuapp.com/api/appointments/appointment_id/${searchValue}`)
					} else {
						 response = await fetch(`https://hospital-project-api.herokuapp.com/api/appointments`)
					}					
					const jsonData = await response.json()
					setAppointmentData(jsonData)
					setLoading(false)
				} catch(error){
					console.log(error.message)
				}
			} else if(searchType === 'doctor_id') {
				setLoading(true)
				try {
					let response 
					if(searchValue.trim().length > 0){
						response = await fetch(`https://hospital-project-api.herokuapp.com/api/appointments/doctor_id/${searchValue}`)
				 } else {
						response = await fetch(`https://hospital-project-api.herokuapp.com/api/appointments`)
				 }	
					const jsonData = await response.json()
					setAppointmentData(jsonData)
					setLoading(false)
				} catch(error){
					console.log(error.message)
				}
			} else {
				setLoading(true)
				try {
					let response 
					if(searchValue.trim().length > 0){
						response = await fetch(`https://hospital-project-api.herokuapp.com/api/appointments/specialty/${searchValue}`)
				 } else {
						response = await fetch(`https://hospital-project-api.herokuapp.com/api/appointments`)
				 }	
					const jsonData = await response.json()
					setAppointmentData(jsonData)
					setLoading(false)
				} catch(error){
					console.log(error.message)
				}
			}
	}
const filterMyAppointment = async () => {
	setLoading(true)
		try {
				const response = await fetch(`https://hospital-project-api.herokuapp.com/api/appointments/doctor_id/${loginData.doctor_id}`)
				const jsonData = await response.json()
				setAppointmentData(jsonData)
				setLoading(false)
		}catch(error){
				console.log(error.message)
		}
}
const addAppointmentHandler = async () => {
	try {
		console.log('runs')
		console.log("room_id:", loginData.room_id)
			let response = await fetch(`https://hospital-project-api.herokuapp.com/api/registrations/${loginData.room_id}`,{mode: 'cors'})
			const jsonData = await response.json()
			console.log('json : ', jsonData)
			// appointment_id, doctor_id, patient_id, specialty_id, room_id, start_time
			const body = {
					appointment_id : `${loginData.doctor_id.slice(-2)}${jsonData.patient_id.slice(-2)}${new Date().toISOString().split('T')[0].slice(-5).replace('-', '')}`,
					doctor_id : loginData.doctor_id,
					patient_id : jsonData.patient_id,
					specialty_id : jsonData.specialty_id,
					room_id : loginData.room_id,
					start_time : new Date().toLocaleString()
			}
			response = await fetch('https://hospital-project-api.herokuapp.com/api/appointments', {
				method : "POST",
				headers : {"Content-Type" : "application/json"},
				body : JSON.stringify(body),
				mode: 'cors'			
			})
			successNotification()
	}catch(error) {
		console.log(error.message)
	}
}
	return (
		<div className={styles.doctorsPage}>
			<RegisterModal isModalVisible={isModalVisible} toggleModal={toggleModalHandler}/>
			<BillModal isBillModalVisible={isBillModalVisible} toggleBillModal={toggleBillModalHandler} appointment_id={selectedAppointmentId} patient_id={selectedPatientId} status_insurance={status_of_insurance}/>
			<ContactRow />
			<Navbar openModal={toggleModalHandler}/>
			<div className={styles.pageTitle}>
				<p className={styles.titleText}>APPOINTMENTS</p>
				<img src={require(`../../assets/appointment.png`)} className={styles.titleLogo}/>
			</div>
				<Button onClick={addAppointmentHandler} size="large" style={{backgroundColor : "#B53E5A", color : "#fff", position:"relative", float : 'right', top : '-40px'}}>Next Patient</Button>
			<Input.Group  compact style={{
				width: '40%',
				position: 'relative',
				float : 'right',
				display :'flex',
				right : "-120px",
				marginBottom :'30px',
				marginRight : '0'
			}}>
			<Tooltip title="my-appointment">
				<Button onClick={() => 
					{setTypeSee(prev => !prev) 
					if(typeSee){
						filterMyAppointment()
					} else {
						getAppointments()
					}
				}} style={{backgroundColor : "#B53E5A", color : "#fff"}}>{typeSee === true ? "My Appointment" : "Current Appointment"}</Button>
			</Tooltip>    
      <Select defaultValue="appoitnment_id" onChange={searchTypeHandler}>
        <Option value="appoitnment_id">Appointment_id</Option>
        <Option value="doctor_id">Doctor Id</Option>
        <Option value="spacialty">Specialty</Option>
      </Select>
      <Input
				placeholder={searchType === 'appoitnment_id' ? "Please type Appointment Id" : searchType === "doctor_id" ? "Please type Doctor ID" : "Please type specialty"} onChange={getSearchData}
      />
			<Tooltip title="search">
				<Button shape="circle" icon={<SearchOutlined />} onClick={searchHandler}/>
			</Tooltip>    
	  </Input.Group>  
				<Table 
						bordered 
				  	size="middle" 
						columns={columns} 
						dataSource={appointmentData}
						loading={loading}
				/>
		</div>

	)
}

export default Appointments;