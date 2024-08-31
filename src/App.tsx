import React, { useState, useEffect } from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Types and Interfaces
interface CarbonFootprintData {
  coalProduction: number;
  energyConsumption: number;
  transportationEmissions: number;
  employeeCommuting: number;
  supplyChainEmissions: number;
}

interface CarbonFootprintReport {
  totalEmissions: number;
  emissionsByCategory: {
    coalProduction: number;
    energyConsumption: number;
    transportationEmissions: number;
    employeeCommuting: number;
    supplyChainEmissions: number;
  };
}

// Main Component
const CarbonFootprintCalculator: React.FC = () => {
  const [carbonFootprintData, setCarbonFootprintData] =
    useState<CarbonFootprintData>({
      coalProduction: 0,
      energyConsumption: 0,
      transportationEmissions: 0,
      employeeCommuting: 0,
      supplyChainEmissions: 0,
    });

  const [carbonFootprintReport, setCarbonFootprintReport] =
    useState<CarbonFootprintReport | null>(null);
  const [emissionFactors, setEmissionFactors] = useState({
    coalProduction: 1.2,
    energyConsumption: 0.8,
    transportationEmissions: 1.5,
    employeeCommuting: 0.2,
    supplyChainEmissions: 1.1,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCarbonFootprintData((prevData) => ({
      ...prevData,
      [name]: Math.max(0, Number(value)),
    }));
  };

  const handleEmissionFactorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setEmissionFactors((prevFactors) => ({
      ...prevFactors,
      [name]: Math.max(0, Number(value)),
    }));
  };

  const calculateCarbonFootprint = () => {
    const {
      coalProduction,
      energyConsumption,
      transportationEmissions,
      employeeCommuting,
      supplyChainEmissions,
    } = carbonFootprintData;
    const {
      coalProduction: efCoal,
      energyConsumption: efEnergy,
      transportationEmissions: efTransport,
      employeeCommuting: efCommuting,
      supplyChainEmissions: efSupplyChain,
    } = emissionFactors;

    const totalEmissions =
      coalProduction * efCoal +
      energyConsumption * efEnergy +
      transportationEmissions * efTransport +
      employeeCommuting * efCommuting +
      supplyChainEmissions * efSupplyChain;

    const emissionsByCategory = {
      coalProduction: coalProduction * efCoal,
      energyConsumption: energyConsumption * efEnergy,
      transportationEmissions: transportationEmissions * efTransport,
      employeeCommuting: employeeCommuting * efCommuting,
      supplyChainEmissions: supplyChainEmissions * efSupplyChain,
    };

    setCarbonFootprintReport({ totalEmissions, emissionsByCategory });
  };

  useEffect(() => {
    calculateCarbonFootprint();
  }, [carbonFootprintData, emissionFactors]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4563"];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Carbon Footprint Calculator
      </h1>
      <form className="mt-8">
        <div className="grid grid-cols-1 gap-6">
          {Object.keys(carbonFootprintData).map((key) => (
            <div key={key} className="col-span-1">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor={key}
              >
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="number"
                name={key}
                id={key}
                value={carbonFootprintData[key as keyof CarbonFootprintData]}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          ))}
          <div className="col-span-1">
            <h2 className="text-lg font-bold">Custom Emission Factors</h2>
            {Object.keys(emissionFactors).map((key) => (
              <div key={key} className="mt-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor={key}
                >
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="number"
                  name={key}
                  id={key}
                  value={emissionFactors[key as keyof typeof emissionFactors]}
                  onChange={handleEmissionFactorChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </form>
      {carbonFootprintReport && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Carbon Footprint Report
          </h2>
          <p className="text-lg text-gray-600">
            Total Emissions: {carbonFootprintReport.totalEmissions.toFixed(2)}{" "}
            tons
          </p>
          <div className="grid grid-cols-1 gap-6">
            {Object.entries(carbonFootprintReport.emissionsByCategory).map(
              ([category, value]) => (
                <div key={category} className="col-span-1">
                  <p className="text-lg text-gray-600">
                    {category.replace(/([A-Z])/g, " $1")}: {value.toFixed(2)}{" "}
                    tons
                  </p>
                </div>
              )
            )}
          </div>
          <div className="mt-4">
            <PieChart width={400} height={300}>
              <Pie
                data={Object.entries(
                  carbonFootprintReport.emissionsByCategory
                ).map(([category, value]) => ({
                  name: category.replace(/([A-Z])/g, " $1"),
                  value,
                }))}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {Object.entries(carbonFootprintReport.emissionsByCategory).map(
                  (_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  )
                )}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarbonFootprintCalculator;
