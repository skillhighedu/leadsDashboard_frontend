// import React, { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Chart } from "@/components/ui/chart"

// export default function Analytics() {
//   // State for selected year
//   const [selectedYear, setSelectedYear] = useState("2025")

//   // Sample sales data
//   const salesData = {
//     2025: {
//       monthly: [
//         { month: "Jan", sales: 4000 },
//         { month: "Feb", sales: 3000 },
//         { month: "Mar", sales: 5000 },
//         { month: "Apr", sales: 4500 },
//         { month: "May", sales: 6000 },
//         { month: "Jun", sales: 5500 },
//         { month: "Jul", sales: 7000 },
//         { month: "Aug", sales: 6500 },
//         { month: "Sep", sales: 8000 },
//         { month: "Oct", sales: 7500 },
//         { month: "Nov", sales: 9000 },
//         { month: "Dec", sales: 8500 },
//       ],
//       categories: [
//         { category: "Electronics", sales: 25000 },
//         { category: "Clothing", sales: 18000 },
//         { category: "Books", sales: 12000 },
//         { category: "Home Decor", sales: 8000 },
//       ],
//       regions: [
//         { region: "North America", sales: 35000 },
//         { region: "India", sales: 25000 },
//         { region: "Europe", sales: 15000 },
//         { region: "Asia", sales: 10000 },
//       ],
//     },
//     2024: {
//       monthly: [
//         { month: "Jan", sales: 3500 },
//         { month: "Feb", sales: 2800 },
//         { month: "Mar", sales: 4500 },
//         { month: "Apr", sales: 4000 },
//         { month: "May", sales: 5500 },
//         { month: "Jun", sales: 5000 },
//         { month: "Jul", sales: 6500 },
//         { month: "Aug", sales: 6000 },
//         { month: "Sep", sales: 7500 },
//         { month: "Oct", sales: 7000 },
//         { month: "Nov", sales: 8500 },
//         { month: "Dec", sales: 8000 },
//       ],
//       categories: [
//         { category: "Electronics", sales: 22000 },
//         { category: "Clothing", sales: 16000 },
//         { category: "Books", sales: 10000 },
//         { category: "Home Decor", sales: 7000 },
//       ],
//       regions: [
//         { region: "North America", sales: 32000 },
//         { region: "India", sales: 23000 },
//         { region: "Europe", sales: 14000 },
//         { region: "Asia", sales: 9000 },
//       ],
//     },
//   }

//   // Chart colors
//   const chartColors = {
//     primary: "#007bff",
//     secondary: "#10b981",
//     tertiary: "#f59e0b",
//     quaternary: "#d1d5db",
//   }

//   // Line Chart Configuration
//   const monthlySalesChart = {
//     type: "line",
//     data: {
//       labels: salesData[selectedYear].monthly.map((item) => item.month),
//       datasets: [
//         {
//           label: "Sales ($)",
//           data: salesData[selectedYear].monthly.map((item) => item.sales),
//           borderColor: chartColors.primary,
//           backgroundColor: chartColors.primary + "33", // 20% opacity
//           fill: true,
//           tension: 0.4,
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           display: true,
//           position: "top",
//           labels: {
//             color: "#374151",
//             usePointStyle: true,
//           },
//         },
//         tooltip: {
//           backgroundColor: "#ffffff",
//           titleColor: "#1f2937",
//           bodyColor: "#1f2937",
//           borderColor: "#e5e7eb",
//           borderWidth: 1,
//         },
//       },
//       scales: {
//         x: {
//           title: {
//             display: true,
//             text: "Month",
//             color: "#374151",
//           },
//           ticks: { color: "#374151" },
//           grid: { display: false },
//         },
//         y: {
//           title: {
//             display: true,
//             text: "Sales ($)",
//             color: "#374151",
//           },
//           ticks: { color: "#374151" },
//           grid: { color: "#e5e7eb" },
//         },
//       },
//     },
//   }

//   // Bar Chart Configuration
//   const categorySalesChart = {
//     type: "bar",
//     data: {
//       labels: salesData[selectedYear].categories.map((item) => item.category),
//       datasets: [
//         {
//           label: "Sales ($)",
//           data: salesData[selectedYear].categories.map((item) => item.sales),
//           backgroundColor: chartColors.secondary,
//           borderColor: chartColors.secondary,
//           borderWidth: 1,
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           display: true,
//           position: "top",
//           labels: {
//             color: "#374151",
//             usePointStyle: true,
//           },
//         },
//         tooltip: {
//           backgroundColor: "#ffffff",
//           titleColor: "#1f2937",
//           bodyColor: "#1f2937",
//           borderColor: "#e5e7eb",
//           borderWidth: 1,
//         },
//       },
//       scales: {
//         x: {
//           title: {
//             display: true,
//             text: "Category",
//             color: "#374151",
//           },
//           ticks: { color: "#374151" },
//           grid: { display: false },
//         },
//         y: {
//           title: {
//             display: true,
//             text: "Sales ($)",
//             color: "#374151",
//           },
//           ticks: { color: "#374151" },
//           grid: { color: "#e5e7eb" },
//         },
//       },
//     },
//   }

//   // Pie Chart Configuration
//   const regionSalesChart = {
//     type: "pie",
//     data: {
//       labels: salesData[selectedYear].regions.map((item) => item.region),
//       datasets: [
//         {
//           label: "Sales ($)",
//           data: salesData[selectedYear].regions.map((item) => item.sales),
//           backgroundColor: [
//             chartColors.primary,
//             chartColors.secondary,
//             chartColors.tertiary,
//             chartColors.quaternary,
//           ],
//           borderColor: "#ffffff",
//           borderWidth: 2,
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           display: true,
//           position: "top",
//           labels: {
//             color: "#374151",
//             usePointStyle: true,
//           },
//         },
//         tooltip: {
//           backgroundColor: "#ffffff",
//           titleColor: "#1f2937",
//           bodyColor: "#1f2937",
//           borderColor: "#e5e7eb",
//           borderWidth: 1,
//         },
//       },
//     },
//   }

//   return (
//     <main className="flex-1 p-8 bg-gray-100 dark:bg-gray-900">
//       <div className="container mx-auto max-w-6xl">
//         {/* Header with Title and Year Filter */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
//             Sales Analytics
//           </h1>
//           <Select
//             value={selectedYear}
//             onValueChange={setSelectedYear}
//             aria-label="Select year"
//           >
//             <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
//               <SelectValue placeholder="Select Year" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="2025">2025</SelectItem>
//               <SelectItem value="2024">2024</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Charts Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Monthly Sales Line Chart */}
//           <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
//             <CardHeader>
//               <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
//                 Monthly Sales Trend
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6">
//               <div className="h-[300px]">
//                 ```chartjs
//                 {monthlySalesChart}
//                 ```
//               </div>
//             </CardContent>
//           </Card>

//           {/* Sales by Category Bar Chart */}
//           <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
//             <CardHeader>
//               <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
//                 Sales by Category
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6">
//               <div className="h-[300px]">
//                 ```chartjs
//                 {categorySalesChart}
//                 ```
//               </div>
//             </CardContent>
//           </Card>

//           {/* Sales by Region Pie Chart */}
//           <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
//             <CardHeader>
//               <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
//                 Sales by Region
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6">
//               <div className="h-[300px]">
//                 ```chartjs
//                 {regionSalesChart}
//                 ```
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </main>
//   )
// }