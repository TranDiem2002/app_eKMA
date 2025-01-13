import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";

const formatTime = (dateString: any) => {
  const date = new Date(dateString);
  const adjustedDate = new Date(date.getTime() - 7 * 60 * 60 * 1000);
  const options: any = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    // timeZone: "Asia/Ho_Chi_Minh",
  };
  return `${adjustedDate.toLocaleTimeString("en-US", options)}`;
};

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [events, setEvents] = useState<any>([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    const getToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        if (savedToken) {
          setToken(savedToken);
        } else {
          Alert.alert("Lỗi", "Không tìm thấy token");
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể lấy token từ bộ nhớ");
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      if (token) {
        try {
          const response = await fetch(
            "http://192.168.76.82:8080/calendar/getAll",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setEvents(data);
        } catch (error) {
          Alert.alert("Lỗi", "Không thể tải dữ liệu lịch học");
        }
      }
    };

    fetchEvents();
  }, [token]);

  const filteredEvents = events.filter(
    (event: any) => event.dateStudy === selectedDate
  );

  const markedDates: any = {};
  events.forEach((event: any) => {
    markedDates[event.dateStudy] = {
      marked: true,
      dotColor: "red",
    };
  });

  if (markedDates[selectedDate]) {
    markedDates[selectedDate].selected = true;
    markedDates[selectedDate].selectedColor = "green";
  } else {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: "green",
    };
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
          }}
          markedDates={markedDates}
          theme={{
            calendarBackground: "#f1fff3",
            textSectionTitleColor: "#00c78c",
            selectedDayBackgroundColor: "#00c78c",
            todayTextColor: "#00d09e",
          }}
        />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {filteredEvents.map((event: any, index: any) => (
          <View key={index} style={styles.eventContainer}>
            <Text style={styles.eventTime}>
              {formatTime(event.startDate)} - {formatTime(event.endDate)}
            </Text>
            <Text style={styles.eventText}>
              {event.monHoc} ({event.maLopHoc})
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00C78C",
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: "#fff",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 30,
  },
  calendarContainer: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f1fff3",
  },
  scrollContainer: {
    marginTop: 20,
    maxHeight: 270,
  },
  eventContainer: {
    marginTop: 10,
    padding: 20,
    backgroundColor: "#f1fff3",
    borderRadius: 10,
  },
  eventTime: {
    fontSize: 12,
    color: "#00d09e",
  },
  eventText: {
    fontSize: 16,
    color: "#00c78c",
  },
});
