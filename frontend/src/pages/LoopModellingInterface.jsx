/* LoopModellingInterface.jsx - Protein Loop Modelling */

import { useState } from 'react';

// UI Components
import { ErrorAlert } from '../components/ui';
import { useAuth } from '../hooks';

// Step-specific components for modular construction
import PDBInputForm from '../components/modelling/PDBInputForm';
import SystemStatusBanners from '../components/modelling/SystemStatusBanners';
import TestingInstructions from '../components/modelling/TestingInstructions';
import ProgressSteps from '../components/modelling/ProgressSteps';
import StructureVisualisation from '../components/modelling/StructureVisualisation';
import ModellingResults from '../components/modelling/ModellingResults';
import ParameterForm from '../components/modelling/ParameterForm';

// API services for backend integration
import * as modellingApi from '../services/modellingApi';

// Custom hook for complex modelling state management
import { useModellingState } from '../hooks/useModellingState';

/* LoopModellingInterface Component */
const LoopModellingInterface = () => {
  // UI State Management
  const [isLoading, setIsLoading] = useState(false);      // Loading state for operations
  const [error, setError] = useState(null);              // Error state for user feedback
  
  // System Status Configuration
  const [systemStatus, setSystemStatus] = useState({ 
    system_ready: true, 
    demo_mode: true,
    message: 'Demo mode active - no authentication required' 
  });

  // State Management via Custom Hook
  const {
    // Workflow State
    step, setStep,
    pdbCode, setPdbCode,
    pdbData, setPdbData,
    selectedChain, setSelectedChain,
    preparation, setPreparation,
    modellingParams, setModellingParams,
    modellingResults, setModellingResults,
    
    // Search State
    searchResults, setSearchResults,
    showSearch, setShowSearch,
    searchQuery, setSearchQuery,
    
    // State Management Functions
    resetInterface
  } = useModellingState();
  
  // Authentication Status
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  /* Workflow Navigation Handlers */
  
  const handleBackToStructure = () => setStep(2);
  const handleParameterSubmit = (backendParams) => submitModelling(backendParams);
  const handleContinueToParameters = () => prepareModelling();
  const handleStartOver = () => resetInterface();
  
  // Result Management Handlers
  const handleDownloadDemo = (jobId) => downloadDemoResults(jobId);
  const handleDownloadAuth = (jobId) => downloadAuthResults(jobId);
  
  // Navigation Handlers
  const handleGoToDashboard = () => { window.location.href = '/dashboard'; };
  const handleRegister = () => { window.location.href = '/register'; };
  const handleLogin = () => { window.location.href = '/login'; };
  const handleReset = () => resetInterface();

  /* Fetch PDB Structure from Database */
  const fetchPDBStructure = async () => {
    if (!pdbCode || pdbCode.length !== 4) {
      setError('Please enter a valid 4-character PDB code');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await modellingApi.fetchPDBStructure(pdbCode, isAuthenticated);
      
      if (result.success) {
        setPdbData(result.data);
        setSelectedChain(result.selectedChain);
        setStep(2);
        setShowSearch(false);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('PDB fetch error:', err);
      setError('Unable to fetch PDB structure. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  /* Search PDB Database */
  const searchPDB = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await modellingApi.searchPDB(searchQuery);
      
      if (result.success) {
        setSearchResults(result.results);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Search service temporarily unavailable. Try PDB codes: 1ADG, 1UBQ, 2LYZ, 1CRN');
    } finally {
      setIsLoading(false);
    }
  };

  /* Select Structure from Search Results */
  const selectFromSearch = (result) => {
    setPdbCode(result.pdb_code);
    setShowSearch(false);
    setSearchResults([]);
  };

  /* Prepare Modelling Parameters */
  const prepareModelling = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await modellingApi.prepareModelling(pdbData, pdbCode, selectedChain, modellingParams);
      
      if (result.success) {
        setPreparation(result.preparation);
        setStep(3);
        
        // Update suggested parameters based on structural analysis
        setModellingParams(prev => ({
          ...prev,
          n_iterations: result.suggestedIterations
        }));
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Preparation error:', err);
      setError('Network error during preparation');
    } finally {
      setIsLoading(false);
    }
  };

  /* Submit Modelling Job to MATLAB */
  const submitModelling = async (backendParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await modellingApi.submitModelling(
        backendParams, 
        modellingParams, 
        pdbData, 
        pdbCode, 
        selectedChain, 
        isAuthenticated
      );
      
      if (result.success) {
        setModellingResults(result.results);
        setStep(4);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Modelling submission error:', err);
      setError('Network error during modelling submission');
    } finally {
      setIsLoading(false);
    }
  };

  /* Download Demo Results */
  const downloadDemoResults = async (jobId) => {
    try {
      const result = await modellingApi.downloadDemoResults(jobId);
      
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      console.error('Download error:', err);
      setError('Download temporarily unavailable');
    }
  };

  /* Download Authenticated User Results */
  const downloadAuthResults = async (jobId) => {
    try {
      const result = await modellingApi.downloadAuthResults(jobId);
      
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      console.error('Download error:', err);
      setError('Download temporarily unavailable');
    }
  };

  return (
    <div className="container-fluid px-3 mt-4">
      <h2>Protein Loop Modelling</h2>

      {/* System Status Banners */}
      <SystemStatusBanners 
        isAuthenticated={isAuthenticated}
        systemStatus={systemStatus}
      />
      
      {/* 
       * Progress Steps Indicator */}
      <ProgressSteps currentStep={step} totalSteps={4} />

      {/* Error Display with Dismiss and Recovery Options */}
      <ErrorAlert 
        error={error}
        onDismiss={() => setError(null)}
      />
      
      {/* Step 1: PDB Structure Input and Search */}
      {step === 1 && (
        <PDBInputForm
          pdbCode={pdbCode}
          setPdbCode={setPdbCode}
          isLoading={isLoading}
          onFetchStructure={fetchPDBStructure}
          showSearch={showSearch}
          onToggleSearch={() => setShowSearch(!showSearch)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          onSearchPDB={searchPDB}
          onSelectFromSearch={selectFromSearch}
          modellingParams={modellingParams}
          setModellingParams={setModellingParams}
        />
      )}
      
      {/* Step 2: Structure Visualisation and Segment Selection */}
      {step === 2 && pdbData && (
        <StructureVisualisation
          pdbData={pdbData}
          selectedChain={selectedChain}
          setSelectedChain={setSelectedChain}
          modellingParams={modellingParams}
          setModellingParams={setModellingParams}
          onContinue={handleContinueToParameters}
          onReset={handleStartOver}
          isLoading={isLoading}
        />
      )}
      
      {/* Step 3: Parameter Configuration and Validation */}
      {step === 3 && preparation && (
        <ParameterForm
          preparation={preparation}
          modellingParams={modellingParams}
          setModellingParams={setModellingParams}
          isLoading={isLoading}
          onSubmit={handleParameterSubmit}
          onBack={handleBackToStructure}
          isAuthenticated={isAuthenticated}
          systemStatus={systemStatus}
        />
      )}
      
      {/* Step 4: Results with Structure Comparison */}
      {step === 4 && modellingResults && (
        <ModellingResults
          modellingResults={modellingResults}
          pdbData={pdbData}
          selectedChain={selectedChain}
          modellingParams={modellingParams}
          isAuthenticated={isAuthenticated}
          onDownloadDemo={handleDownloadDemo}
          onDownloadAuth={handleDownloadAuth}
          onReset={handleReset}
          onGoToDashboard={handleGoToDashboard}
          onRegister={handleRegister}
          onLogin={handleLogin}
          onBack={() => setStep(3)}
        />
      )}
      
      {/* Testing Instructions */}
      {step === 1 && (
        <TestingInstructions isAuthenticated={isAuthenticated} />
      )}
      
    </div>
  );
};

export default LoopModellingInterface;