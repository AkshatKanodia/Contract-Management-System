import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getContract, getContractHistory, deleteContract } from '../features/contracts/contractSlice';

const ContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { currentContract, contractHistory, isLoading } = useSelector((state) => state.contracts);

  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(getContract(id));
    dispatch(getContractHistory(id));
  }, [id, user, navigate, dispatch]);

  const handleDelete = () => {
    if (window.confirm('Are you absolutely sure you want to delete this contract? This cannot be undone.')) {
      dispatch(deleteContract(currentContract._id)).then(() => {
        navigate('/');
      });
    }
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

  if (isLoading || !currentContract) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading contract details...</div>;
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>{currentContract.title}</h2>
          <span className={`status-badge ${getStatusClass(currentContract.status)}`}>
            {currentContract.status}
          </span>
        </div>
        <div>
          {user.role === 'Admin' && (
            <button className="btn btn-danger" onClick={handleDelete} style={{ marginRight: '1rem' }}>
              Delete Contract
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => navigate(`/contract/${currentContract._id}/edit`)} style={{ marginRight: '1rem' }}>
            Edit Contract
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Back to Dashboard
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button 
          className={`btn ${activeTab === 'details' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button 
          className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('history')}
        >
          Version History
        </button>
      </div>

      <div className="glass-panel">
        {activeTab === 'details' && (
          <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h4 style={{ color: 'var(--text-muted)' }}>Description</h4>
                <p style={{ marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                  {currentContract.description || 'No description provided.'}
                </p>
                
                <h4 style={{ color: 'var(--text-muted)' }}>Parties Involved</h4>
                <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.2rem' }}>
                  {currentContract.parties && currentContract.parties.length > 0 
                    ? currentContract.parties.map((party, idx) => <li key={idx}>{party}</li>)
                    : <li>No parties listed</li>}
                </ul>
              </div>
              
              <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.4)' }}>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Metadata</h4>
                
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.85rem' }}>Start Date</span>
                  <strong>{currentContract.startDate ? new Date(currentContract.startDate).toLocaleDateString() : 'N/A'}</strong>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.85rem' }}>End Date</span>
                  <strong>{currentContract.endDate ? new Date(currentContract.endDate).toLocaleDateString() : 'N/A'}</strong>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.85rem' }}>Created By</span>
                  <strong>{currentContract.createdBy?.username || 'Unknown'}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-fade-in">
            <h4 style={{ marginBottom: '1.5rem' }}>Audit Timeline</h4>
            {contractHistory.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No previous versions found for this contract.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {contractHistory.map((history, index) => (
                  <div key={history._id} style={{ 
                    borderLeft: '2px solid var(--primary-color)', 
                    paddingLeft: '1.5rem', 
                    paddingBottom: '1rem',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '-6px',
                      top: '0',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: 'var(--primary-color)'
                    }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong>Version {history.versionNumber}</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(history.timestamp || history.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                      Updated by: {history.updatedBy?.username || 'Unknown'}
                    </p>
                    <div style={{ 
                      fontSize: '0.85rem', 
                      background: 'rgba(0,0,0,0.2)', 
                      padding: '0.5rem', 
                      borderRadius: '4px',
                      marginTop: '0.5rem'
                    }}>
                      <details>
                        <summary style={{ cursor: 'pointer', outline: 'none', fontWeight: 500 }}>View Changes (Diff)</summary>
                        <div style={{ marginTop: '0.8rem', background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '8px', color: 'var(--text-main)' }}>
                          {(() => {
                            const newerState = index === 0 ? currentContract : contractHistory[index - 1].snapshot;
                            const differences = [];
                            const keysToCheck = ['title', 'description', 'status', 'startDate', 'endDate', 'parties'];

                            keysToCheck.forEach(key => {
                              let oldVal = history.snapshot[key];
                              let newVal = newerState[key];

                              if (Array.isArray(oldVal)) oldVal = oldVal.join(', ');
                              if (Array.isArray(newVal)) newVal = newVal.join(', ');
                              
                              if (key === 'startDate' || key === 'endDate') {
                                oldVal = oldVal ? new Date(oldVal).toLocaleDateString() : 'N/A';
                                newVal = newVal ? new Date(newVal).toLocaleDateString() : 'N/A';
                              }

                              if (oldVal !== newVal) {
                                differences.push(
                                  <div key={key} style={{ marginBottom: '0.5rem' }}>
                                    <strong style={{ textTransform: 'capitalize', width: '100px', display: 'inline-block' }}>{key}: </strong>
                                    <span style={{ textDecoration: 'line-through', color: 'var(--danger-color)', marginRight: '0.5rem' }}>
                                      {oldVal || 'empty'}
                                    </span>
                                    <span style={{ color: 'var(--text-muted)' }}>➔</span>
                                    <span style={{ color: 'var(--success-color)', marginLeft: '0.5rem' }}>
                                      {newVal || 'empty'}
                                    </span>
                                  </div>
                                );
                              }
                            });

                            if (differences.length === 0) return <div style={{ color: 'var(--text-muted)' }}>No changes detected in tracked fields.</div>;
                            return differences;
                          })()}
                        </div>
                      </details>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractDetail;

