import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createContract, getContract, updateContract, reset } from '../features/contracts/contractSlice';

const ContractFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { currentContract, isError, isSuccess, message } = useSelector(
    (state) => state.contracts
  );

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    parties: '', // we will process this as comma separated string
    startDate: '',
    endDate: '',
    status: 'Draft',
  });

  const { title, description, parties, startDate, endDate, status } = formData;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }

    if (isEditMode) {
      dispatch(getContract(id));
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch, id, isEditMode]);

  useEffect(() => {
    if (isEditMode && currentContract && currentContract._id === id) {
      setFormData({
        title: currentContract.title || '',
        description: currentContract.description || '',
        parties: currentContract.parties ? currentContract.parties.join(', ') : '',
        startDate: currentContract.startDate ? currentContract.startDate.split('T')[0] : '',
        endDate: currentContract.endDate ? currentContract.endDate.split('T')[0] : '',
        status: currentContract.status || 'Draft',
      });
    }
  }, [currentContract, isEditMode, id]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    // Process parties string into array
    const partiesArray = parties.split(',').map(p => p.trim()).filter(p => p);

    const contractData = {
      title,
      description,
      parties: partiesArray,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      status
    };

    if (isEditMode) {
      dispatch(updateContract({ id, data: contractData }))
        .unwrap()
        .then(() => {
          navigate(`/contract/${id}`);
        })
        .catch((err) => {
          alert('Error: ' + err);
        });
    } else {
      dispatch(createContract(contractData))
        .unwrap()
        .then(() => {
          navigate('/');
        })
        .catch((err) => {
          alert('Error: ' + err);
        });
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>{isEditMode ? 'Edit Contract' : 'Create New Contract'}</h2>
        <button className="btn btn-secondary" onClick={() => navigate(isEditMode ? `/contract/${id}` : '/')}>
          Cancel
        </button>
      </div>

      <div className="glass-panel">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Contract Title *</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={title}
              onChange={onChange}
              required
              placeholder="e.g. Non-Disclosure Agreement"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={description}
              onChange={onChange}
              rows="4"
              placeholder="Provide a summary or full text..."
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Parties Involved (Comma separated)</label>
            <input
              type="text"
              className="form-control"
              name="parties"
              value={parties}
              onChange={onChange}
              placeholder="Company A, Company B, John Doe"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                name="startDate"
                value={startDate}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                name="endDate"
                value={endDate}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-control"
              name="status"
              value={status}
              onChange={onChange}
            >
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Executed">Executed</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              {isEditMode ? 'Save Changes' : 'Create Contract'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractFormPage;
