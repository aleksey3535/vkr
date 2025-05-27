package models


type Appointment struct {
	QueueNumber    string `json:"queueNumber"`
	FullName       string `json:"fullName"`
	PassportNumber string `json:"passportNumber"`
	StartTime      string `json:"startTime"`
	Cabinet        int    `json:"cabinet"`
}

type AppointmentForAdmin struct {
	AppointmentID  int    `json:"id"`
	QueueNumber    string `json:"queueNumber"`
	FullName       string `json:"fullName"`
	PassportNumber string `json:"passportNumber"`
	StartTime      string `json:"startTime"`
	Status         string `json:"status"`
}

type AppointmentsForStatus struct {
	AppointmentID int    `json:"id"`
	QueueNumber   string `json:"queueNumber"`
	Surname       string `json:"surname"`
	StartTime     string `json:"startTime"`
	Cabinet       int    `json:"cabinet"`
}
