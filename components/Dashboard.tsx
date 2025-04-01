import DashboardWidgets from "./DashboardWidgets";

const Dashboard = () => {
  return (
    <section className="flex flex-col gap-14 px-4 md:px-10 pb-10">
      <h2 className="text-3xl lg:text-5xl font-semibold text-center">Dashboard</h2>
      <div className="bg-coffee dark:bg-cream rounded-lg">
        <DashboardWidgets
          container="grid grid-cols-1 md:grid-cols-2 gap-4 p-4"
          wrapper="bg-cream dark:bg-coffee"
        />
      </div>
    </section>
  );
};
export default Dashboard;
