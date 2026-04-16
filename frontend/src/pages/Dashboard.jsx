import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getContracts, reset } from '../features/contracts/contractSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { contracts, isLoading, isError, message, page, pages } = useSelector(
    (state) => state.contracts
  );

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'createdAt'
  });

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    
    if (!user) {
      navigate('/login');
      return;
    }

    const queryParams = new URLSearchParams();
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);

    dispatch(getContracts(queryParams.toString()));

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Draft': return 'status-draft';
      case 'Active': return 'status-active';
      case 'Executed': return 'status-executed';
      case 'Expired': return 'status-expired';
      default: return 'status-draft';
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Contracts Dashboard</h2>
        <Link to="/contract/new" className="btn btn-primary">
          + New Contract
        </Link>
      </div>

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div className="filters-bar">
          <input
            type="text"
            className="form-control search-input"
            name="search"
            placeholder="Search by title or party..."
            value={filters.search}
            onChange={handleFilterChange}
          />
          <select 
            className="form-control" 
            style={{ width: '200px' }} 
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
            <option value="Executed">Executed</option>
            <option value="Expired">Expired</option>
          </select>
          <select 
            className="form-control" 
            style={{ width: '200px' }} 
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
          >
            <option value="createdAt">Newest First</option>
            <option value="createdAt_asc">Oldest First</option>
            <option value="updatedAt">Recently Updated</option>
          </select>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
        ) : (
          <div className="table-container">
            {contracts.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => (
                    <tr key={contract._id}>
                      <td>
                        <strong>{contract.title}</strong>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(contract.status)}`}>
                          {contract.status}
                        </span>
                      </td>
                      <td>{contract.startDate ? new Date(contract.startDate).toLocaleDateString() : '-'}</td>
                      <td>{contract.endDate ? new Date(contract.endDate).toLocaleDateString() : '-'}</td>
                      <td>{contract.createdBy?.username || '-'}</td>
                      <td>
                        <Link to={`/contract/${contract._id}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No contracts found matching your filters.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
