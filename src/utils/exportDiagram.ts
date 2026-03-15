import { toPng } from 'html-to-image';

export const downloadDiagram = async (tabName: string) => {
  const container = document.getElementById('diagram-container');
  if (!container) return;

  // Get the actual elements to capture their bounds
  const viewport = container.querySelector('.react-flow__viewport') as HTMLElement;
  if (!viewport) return;

  const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#282a36';

  try {
    const nodes = container.querySelectorAll('.react-flow__node');
    if (nodes.length === 0) return;

    // We rely on fitView being called before this function to center content
    const dataUrl = await toPng(container, {
      backgroundColor: bgColor,
      pixelRatio: 2,
      filter: (node) => {
        const className = node.className || '';
        if (typeof className === 'string') {
          if (className.includes('react-flow__controls')) return false;
          if (className.includes('diagram-toolbar')) return false;
        }
        return true;
      }
    });

    const link = document.createElement('a');
    link.download = `${tabName.replace(/\s+/g, '_')}_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error exporting diagram:', error);
  }
};
