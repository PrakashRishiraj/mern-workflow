import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/userContext';
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from "moment"
import { addThousandsSeparator } from '../../utils/helper';
import InfoCard from '../../components/Cards/InfoCard';
import TaskListTable from '../../components/TaskListTable';
import { LuArrowRight } from 'react-icons/lu';
import CustomPieChart from '../../components/Charts/CustomPieChart';
import CustomBarChart from '../../components/Charts/CustomBarChart';

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"]

const Dashboard = () => {

  useUserAuth();

  const {user} = useContext(UserContext);

  const navigate  = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if(response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts)
      };
    } catch (error) {
      console.log("Error fetching users: ", error)
    }
  }

  // Prepare Chart data
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || {};
    const taskPriorityLevel = data?.taskPriorityLevels || {};

    // 🍕 Pie Chart
    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];
    setPieChartData(taskDistributionData);

    // 📊 Bar Chart
    const PriorityLevelData = [
      { priority: "Low", count: taskPriorityLevel?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevel?.Medium || 0 },
      { priority: "High", count: taskPriorityLevel?.High || 0 },
    ];
    setBarChartData(PriorityLevelData);
  };

  const onSeeMore = () => {
    navigate("/admin/tasks")
  }

  useEffect(() => {
    getDashboardData();

    return () => {}
  }, [])

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className='card my-5'>
        <div>
          <div className='col-span-3'>
            <h2 className='text-xl md:text-2xl'>Lets Get Productive, <span className="bg-linear-to-r from-indigo-400 via-indigo-500 to-slate-400 bg-clip-text text-transparent font-semibold">
              {user?.name}
            </span>
            .
            </h2>
            <p className='text-xs md:text-[13px] text-grey-400 mt-1.5 pb-5'>
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>
        </div>

        <div className='mt-6 flex flex-wrap gap-5 justify-between'>
          <InfoCard
            label="Total Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.All || 0
            )}
            color="bg-primary"
          />

          <InfoCard
            label="Pending Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Pending || 0
            )}
            color="bg-violet-500"
          />

          <InfoCard
            label="In Progress Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.InProgress || 0
            )}
            color="bg-cyan-500"
          />

          <InfoCard
            label="Completed Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.Completed || 0
            )}
            color="bg-lime-500"
          />
        </div>
      </div>
            
      <div>
        <div className='p-5 bg-linear-to-br from-slate-900 to-slate-950 border border-slate-700/40 
        rounded-xl shadow-md shadow-indigo-900/30 hover:shadow-indigo-800/40 transition-all duration-300'>
          <div className='flex items-center justify-between'>
            <h5 className='text-gray-200 font-medium'>Task Distribution</h5>
          </div>

          <CustomPieChart
            data={pieChartData}
            colors={COLORS}
          />
        </div>
      </div>

      <div>
        <div className='p-5 bg-linear-to-br from-slate-900 to-slate-950 border border-slate-700/40 
        rounded-xl shadow-md shadow-indigo-900/30 hover:shadow-indigo-800/40 transition-all duration-300 mt-6'>
          <div className='flex items-center justify-between'>
            <h5 className='text-gray-200 font-medium'>Task Priority Levels</h5>
          </div>

          <CustomBarChart
            data={barChartData}
          />
        </div>
      </div>

      <div className="w-full mt-6">
        <div className="bg-card border border-border rounded-2xl shadow-sm p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h5 className="text-lg font-semibold text-foreground">Recent Tasks</h5>

              <button
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                onClick={onSeeMore}
              >
                See All <LuArrowRight className="text-base" />
              </button>
            </div>

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>

    </DashboardLayout>
  )
}

export default Dashboard