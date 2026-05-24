const ProfileSummary = ({ user }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border">
      <h2 className="text-lg font-semibold mb-4">Profile</h2>

      <div className="space-y-2">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Blood Group:</strong> {user?.bloodGroup}</p>
        <p><strong>Location:</strong> {user?.location}</p>
      </div>
    </div>
  );
};

export default ProfileSummary;