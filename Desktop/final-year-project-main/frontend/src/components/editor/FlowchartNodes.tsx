import React from 'react';
import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const nodeStyles = {
  background: '#fff',
  borderRadius: '3px',
  padding: '10px',
  minWidth: '150px',
};

const handleStyle = {
  width: '8px',
  height: '8px',
  background: '#555',
};

const BaseNode = memo(({ data, children }: NodeProps & { children?: React.ReactNode }) => (
  <div style={{ ...nodeStyles, border: `2px solid ${data.borderColor || '#ccc'}` }}>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <div style={{ textAlign: 'center', color: '#333' }}>{data.label}</div>
    {children}
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </div>
));

// Standard Nodes
const TerminalNode = memo((props: NodeProps) => {
  // Set color based on label - green for Start, red for End
  const isStart = props.data.label?.toLowerCase() === 'start';
  const defaultColor = isStart ? '#90EE90' : '#FFB6C1';
  
  return (
    <div style={{ 
      ...nodeStyles, 
      border: `2px solid ${isStart ? '#4CAF50' : '#FF5555'}`,
      borderRadius: '25px',
      background: defaultColor
    }}>
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <div style={{ textAlign: 'center', color: '#333' }}>{props.data.label}</div>
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </div>
  );
});

const ProcessNode = memo((props: NodeProps) => (
  <div style={{ 
    ...nodeStyles, 
    border: '2px solid #2196F3',
    background: '#ADD8E6'
  }}>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <div style={{ textAlign: 'center', color: '#333' }}>{props.data.label}</div>
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </div>
));

const PredefinedProcessNode = memo((props: NodeProps) => (
  <div style={{ 
    ...nodeStyles, 
    border: '2px solid #2196F3',
    background: '#E3F2FD',
    position: 'relative',
    paddingLeft: '20px',
    paddingRight: '20px'
  }}>
    <div style={{ position: 'absolute', left: '10px', top: 0, bottom: 0, width: '2px', background: '#2196F3' }}></div>
    <div style={{ position: 'absolute', right: '10px', top: 0, bottom: 0, width: '2px', background: '#2196F3' }}></div>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <div style={{ textAlign: 'center', color: '#333' }}>{props.data.label}</div>
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </div>
));

const DecisionNode = memo((props: NodeProps) => (
  <div style={{ 
    width: '120px', 
    height: '120px', 
    transform: 'rotate(45deg)',
    background: '#FFF9C4',
    border: '2px solid #FFC107',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <Handle 
      type="target" 
      position={Position.Top} 
      id="top"
      style={{ ...handleStyle, transform: 'rotate(-45deg)' }} 
    />
    <div style={{ transform: 'rotate(-45deg)', textAlign: 'center', width: '85px' }}>
      {props.data.label}
    </div>
    <Handle 
      type="source" 
      position={Position.Left} 
      id="left"
      style={{ ...handleStyle, transform: 'rotate(-45deg)' }} 
    />
    <Handle 
      type="source" 
      position={Position.Right} 
      id="right"
      style={{ ...handleStyle, transform: 'rotate(-45deg)' }} 
    />
    <Handle 
      type="source" 
      position={Position.Bottom} 
      id="bottom"
      style={{ ...handleStyle, transform: 'rotate(-45deg)' }} 
    />
  </div>
));

const InputNode = memo((props: NodeProps) => {
  // Using an approach to overcome ReactFlow border issue
  return (
    <div 
      className="custom-node"
      style={{
        width: '150px',
        height: '60px',
        position: 'relative',
        // Critically important - transparent background and no border on container
        background: 'transparent',
        border: 'none',
        borderRadius: '0',
        overflow: 'visible'
      }}
    >
      {/* The actual visible node is an inner element */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          background: '#F0E68C',
          border: '2px solid #00BCD4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)'
        }}
      >
        <div style={{ textAlign: 'center', color: '#333' }}>{props.data.label}</div>
      </div>
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </div>
  );
});

const OutputNode = memo((props: NodeProps) => {
  // Using an approach to overcome ReactFlow border issue
  return (
    <div 
      className="custom-node"
      style={{
        width: '150px',
        height: '60px',
        position: 'relative',
        // Critically important - transparent background and no border on container
        background: 'transparent',
        border: 'none',
        borderRadius: '0',
        overflow: 'visible'
      }}
    >
      {/* The actual visible node is an inner element */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          background: '#D8BFD8',
          border: '2px solid #FF5722',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          clipPath: 'polygon(0% 0%, 85% 0%, 100% 100%, 15% 100%)'
        }}
      >
        <div style={{ textAlign: 'center', color: '#333' }}>{props.data.label}</div>
      </div>
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </div>
  );
});

// Additional Node Types
const DocumentNode = memo((props: NodeProps) => (
  <div style={{ 
    ...nodeStyles, 
    width: '150px',
    borderRadius: '3px 3px 20px 3px',
    background: '#F3E5F5',
    border: '2px solid #9C27B0'
  }}>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <div style={{ textAlign: 'center', color: '#333' }}>{props.data.label}</div>
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </div>
));

const ManualInputNode = memo((props: NodeProps) => (
  <div style={{ 
    ...nodeStyles, 
    width: '150px',
    clipPath: 'polygon(0% 20%, 100% 0%, 100% 100%, 0% 100%)',
    paddingTop: '15px',
    background: '#FFF3E0',
    border: '2px solid #FF9800'
  }}>
    <Handle type="target" position={Position.Top} style={{ ...handleStyle, top: '20%' }} />
    <div style={{ textAlign: 'center', color: '#333' }}>{props.data.label}</div>
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </div>
));

const DisplayNode = memo((props: NodeProps) => (
  <div style={{ 
    ...nodeStyles, 
    width: '150px',
    clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)',
    background: '#E8EAF6',
    border: '2px solid #3F51B5',
    paddingLeft: '15px',
    paddingRight: '15px'
  }}>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <div style={{ textAlign: 'center', color: '#333' }}>{props.data.label}</div>
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </div>
));

const PreparationNode = memo((props: NodeProps) => (
  <div style={{ 
    ...nodeStyles, 
    width: '150px',
    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    background: '#FFF8E1',
    border: '2px solid #FFC107',
    paddingLeft: '20px',
    paddingRight: '20px'
  }}>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <div style={{ textAlign: 'center', color: '#333' }}>{props.data.label}</div>
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </div>
));

const ConnectorNode = memo((props: NodeProps) => (
  <div style={{ 
    width: '50px', 
    height: '50px', 
    borderRadius: '50%',
    background: '#E1F5FE',
    border: '2px solid #03A9F4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <div style={{ textAlign: 'center', color: '#333', fontSize: '12px' }}>{props.data.label}</div>
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </div>
));

const OffPageNode = memo((props: NodeProps) => (
  <div style={{ 
    ...nodeStyles, 
    width: '120px',
    clipPath: 'polygon(0% 0%, 80% 0%, 80% 70%, 100% 70%, 80% 100%, 0% 100%)',
    background: '#E0F2F1',
    border: '2px solid #009688',
    paddingRight: '15px'
  }}>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <div style={{ textAlign: 'center', color: '#333' }}>{props.data.label}</div>
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </div>
));

const DatabaseNode = memo((props: NodeProps) => (
  <div style={{ 
    ...nodeStyles, 
    width: '150px',
    borderRadius: '10px 10px 0 0',
    background: '#FFEBEE',
    border: '2px solid #F44336',
    position: 'relative',
    paddingTop: '20px'
  }}>
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      height: '10px', 
      background: '#FFEBEE',
      borderBottom: '2px solid #F44336',
      borderRadius: '10px 10px 0 0'
    }}></div>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <div style={{ textAlign: 'center', color: '#333' }}>{props.data.label}</div>
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </div>
));

const DataStorageNode = memo((props: NodeProps) => (
  <div style={{ 
    ...nodeStyles, 
    width: '150px',
    borderRadius: '0 10px 10px 0',
    background: '#F3E5F5',
    border: '2px solid #9C27B0',
    position: 'relative',
    paddingLeft: '15px'
  }}>
    <div style={{ 
      position: 'absolute', 
      top: '10px', 
      bottom: '10px', 
      left: '5px', 
      width: '2px', 
      background: '#9C27B0'
    }}></div>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <div style={{ textAlign: 'center', color: '#333' }}>{props.data.label}</div>
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </div>
));

const MergeNode = memo((props: NodeProps) => (
  <div style={{ 
    width: '80px', 
    height: '80px', 
    clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
    background: '#E0F2F1',
    border: '2px solid #009688',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <Handle type="target" position={Position.Top} style={{ ...handleStyle, top: '30%' }} />
    <div style={{ textAlign: 'center', color: '#333', marginTop: '20px', fontSize: '12px' }}>{props.data.label}</div>
    <Handle type="source" position={Position.Bottom} style={{ ...handleStyle, bottom: '10%' }} />
  </div>
));

const DelayNode = memo((props: NodeProps) => (
  <div style={{ 
    ...nodeStyles, 
    width: '150px',
    borderRadius: '0 40px 40px 0',
    background: '#FCE4EC',
    border: '2px solid #E91E63'
  }}>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <div style={{ textAlign: 'center', color: '#333' }}>{props.data.label}</div>
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </div>
));

const AlternateProcessNode = memo((props: NodeProps) => (
  <div style={{ 
    ...nodeStyles, 
    border: '2px solid #673AB7',
    borderRadius: '8px',
    background: '#EDE7F6'
  }}>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <div style={{ textAlign: 'center', color: '#333' }}>{props.data.label}</div>
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </div>
));

const SortNode = memo((props: NodeProps) => (
  <div style={{ 
    width: '80px', 
    height: '80px', 
    clipPath: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)',
    background: '#F1F8E9',
    border: '2px solid #8BC34A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <Handle type="target" position={Position.Top} style={{ ...handleStyle, top: '30%' }} />
    <div style={{ textAlign: 'center', color: '#333', fontSize: '12px' }}>{props.data.label}</div>
    <Handle type="source" position={Position.Right} style={{ ...handleStyle, right: '30%' }} />
    <Handle type="source" position={Position.Bottom} style={{ ...handleStyle, bottom: '30%' }} />
  </div>
));

const AnnotationNode = memo((props: NodeProps) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    padding: '10px'
  }}>
    <div style={{ width: '30px', borderTop: '2px dashed #616161' }}></div>
    <div style={{ 
      padding: '8px',
      border: '1px solid #9E9E9E',
      background: '#F5F5F5',
      borderRadius: '3px',
      fontSize: '12px'
    }}>
      {props.data.label}
    </div>
    <Handle type="target" position={Position.Left} style={{ ...handleStyle, left: 0 }} />
  </div>
));

const SummingJunctionNode = memo((props: NodeProps) => (
  <div style={{ 
    width: '60px', 
    height: '60px', 
    borderRadius: '50%',
    background: '#E3F2FD',
    border: '2px solid #2196F3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  }}>
    <div style={{ position: 'absolute', width: '40px', height: '2px', background: '#2196F3' }}></div>
    <div style={{ position: 'absolute', width: '2px', height: '40px', background: '#2196F3' }}></div>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <Handle type="target" position={Position.Left} style={handleStyle} />
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </div>
));

const OrNode = memo((props: NodeProps) => (
  <div style={{ 
    width: '60px', 
    height: '60px', 
    borderRadius: '50%',
    background: '#FCE4EC',
    border: '2px solid #E91E63',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  }}>
    <div style={{ position: 'absolute', width: '2px', height: '40px', background: '#E91E63', transform: 'rotate(45deg)' }}></div>
    <div style={{ position: 'absolute', width: '2px', height: '40px', background: '#E91E63', transform: 'rotate(-45deg)' }}></div>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <Handle type="target" position={Position.Left} style={handleStyle} />
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </div>
));

const nodeTypeMap = {
  terminal: TerminalNode,
  process: ProcessNode,
  predefined: PredefinedProcessNode,
  decision: DecisionNode,
  input: InputNode,
  output: OutputNode,
  document: DocumentNode,
  manual_input: ManualInputNode,
  display: DisplayNode,
  preparation: PreparationNode,
  connector: ConnectorNode,
  off_page: OffPageNode,
  database: DatabaseNode,
  data_storage: DataStorageNode,
  merge: MergeNode,
  delay: DelayNode,
  alternate_process: AlternateProcessNode,
  sort: SortNode,
  annotation: AnnotationNode,
  summing_junction: SummingJunctionNode,
  or: OrNode
};

export { nodeTypeMap as nodeTypes };