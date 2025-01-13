import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  Button,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

export default function ResultsScreen() {
  const [gpa, setGpa] = useState(3.2);
  const [xeploai, setXeploai] = useState("");
  const [token, setToken] = useState("");
  const [yearDetails, setYearDetails] = useState<any[]>([]);
  const [chartData, setChartData] = useState({
    labels: ["Năm 1", "Năm 2", "Năm 3", "Năm 4", "Năm 5"],
    datasets: [
      {
        data: [0, 0, 0, 0, 0],
      },
    ],
  });

  const [selectedYear, setSelectedYear] = useState(10);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

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
    const fetchGPAData = async () => {
      if (token) {
        try {
          const response = await fetch(
            "http://172.20.10.2:8080/user/getAllDiem",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();
          if (data) {
            setGpa(data.gpa);
            setXeploai(data.xeploai);

            const labels = data.diemNamHocModels.map(
              (item: any) => item.namhoc
            );
            const scores = data.diemNamHocModels.map(
              (item: any) => item.diemtb
            );

            setChartData({
              labels: labels,
              datasets: [
                {
                  data: scores,
                },
              ],
            });
          }
        } catch (error) {
          Alert.alert("Lỗi", "Không thể tải dữ liệu điểm số");
        }
      }
    };

    fetchGPAData();
  }, [token]);

  const fetchYearDetails = async (namhoc: number) => {
    try {
      const response = await fetch("http://172.20.10.2:8080/get/hockidetail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(namhoc),
      });

      const data = await response.json();
      if (data) {
        setYearDetails(data);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải chi tiết năm học");
    }
  };

  useEffect(() => {
    if (selectedYear !== 10) {
      fetchYearDetails(selectedYear);
    }
  }, [selectedYear]);

  const handlePressSubject = (subject: any) => {
    setSelectedSubject(subject);
    setShowDetails(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Result</Text>
        <Text style={styles.gpaTitle}>GPA</Text>
        <Text style={styles.gpaValue}>{gpa}</Text>
        <Text style={styles.xeploai}>{xeploai}</Text>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Điểm Các Năm Học</Text>
        <Picker
          selectedValue={selectedYear}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}
        >
          <Picker.Item label="---" value={10} key="default" />
          {chartData.labels.map((year) => (
            <Picker.Item label={year} value={year} key={year} />
          ))}
        </Picker>

        {selectedYear === 10 ? (
          <BarChart
            data={chartData}
            width={Dimensions.get("window").width}
            height={250}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForBackgroundLines: {
                strokeDasharray: "",
              },
            }}
            style={{
              marginVertical: 5,
              borderRadius: 16,
            }}
            verticalLabelRotation={30}
            fromZero={true}
          />
        ) : (
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableHeader}>Môn học</Text>
              <Text style={styles.tableHeader}>Điểm</Text>
            </View>

            {yearDetails.length > 0 ? (
              yearDetails.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.subjectRow}
                  onPress={() => handlePressSubject(item)}
                >
                  <Text style={styles.subjectText}>{item.monHoc}</Text>
                  <Text style={styles.subjectText}>{item.diemChu}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>Không có dữ liệu chi tiết</Text>
            )}
          </View>
        )}
      </View>

      <Modal visible={showDetails} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedSubject?.monHoc}</Text>
            <Text>Điểm TP1: {selectedSubject?.diemTP1}</Text>
            <Text>Điểm TP2: {selectedSubject?.diemTP2}</Text>
            <Text>Điểm Tổng Kết: {selectedSubject?.diemTK}</Text>
            <Text style={styles.modalContentDetailEnd}>
              Điểm Chữ: {selectedSubject?.diemChu}
            </Text>

            <Button title="Đóng" onPress={() => setShowDetails(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#00C78C",
    padding: 20,
    alignItems: "center",
  },
  resultContainer: {
    marginTop: 50,
    alignItems: "center",
    paddingBottom: 60,
  },
  resultTitle: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  gpaTitle: {
    fontSize: 28,
    color: "#fff",
  },
  gpaValue: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
  },
  xeploai: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
  },
  chartTitle: {
    fontSize: 18,
    color: "#333",
  },
  picker: {
    marginLeft: 200,
    height: 35,
    width: 150,
    color: "#333",
  },
  chartContainer: {
    backgroundColor: "#F1FFF3",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    height: 500,
  },
  table: {
    width: "90%",
  },
  tableHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
    width: "100%",
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tableHeaderRight: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  subjectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#e0e0e0",
    marginVertical: 5,
    borderRadius: 10,
    width: "100%",
  },
  subjectText: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
  },
  subjectTextRight: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalContentDetailEnd: {
    marginBottom: 20,
  },
});
