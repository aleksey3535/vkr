package models

type Slot struct {
	TimeSlotID int    `json:"id"`
	StartTime  string `json:"startTime"`
	IsBusy     bool   `json:"isBusy"`
}
