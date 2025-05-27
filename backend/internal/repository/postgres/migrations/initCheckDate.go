package migrations

import "time"

func InitCheckDate(now time.Time) map[time.Time][]int {
	dates := make(map[time.Time][]int)
	dates[time.Date(now.Year(), now.Month(), now.Day(), 14, 00, 0, 0, now.Location())] = []int {1, 11, 21}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 14, 10, 0, 0, now.Location())] = []int {22}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 14, 15, 0, 0, now.Location())] = []int {2, 12}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 14, 20, 0, 0, now.Location())] = []int {23}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 14, 30, 0, 0, now.Location())] = []int {3, 13, 24}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 14, 40, 0, 0, now.Location())] = []int {25}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 14, 45, 0, 0, now.Location())] = []int {4, 14}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 14, 50, 0, 0, now.Location())] = []int {26}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 15, 00, 0, 0, now.Location())] = []int {5, 15,27}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 15, 10, 0, 0, now.Location())] = []int {28}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 15, 15, 0, 0, now.Location())] = []int {6, 16}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 15, 20, 0, 0, now.Location())] = []int {29}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 15, 30, 0, 0, now.Location())] = []int {7, 17, 30}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 15, 40, 0, 0, now.Location())] = []int {31}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 15, 45, 0, 0, now.Location())] = []int {8, 18}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 15, 50, 0, 0, now.Location())] = []int {32}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 16, 00, 0, 0, now.Location())] = []int {9, 19, 33}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 16, 10, 0, 0, now.Location())] = []int {34}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 16, 15, 0, 0, now.Location())] = []int {10, 20}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 16, 20, 0, 0, now.Location())] = []int {35}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 16, 30, 0, 0, now.Location())] = []int {36}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 16, 40, 0, 0, now.Location())] = []int {37}
	dates[time.Date(now.Year(), now.Month(), now.Day(), 16, 50, 0, 0, now.Location())] = []int {38}
	return dates
	
}