import React, { useEffect } from "react";
import {
  Document,
  Page,
  View,
  Text,
  PDFViewer,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { GRID_CONFIG } from '../config/gridConfig';


const gridConfig = {
  ...GRID_CONFIG,
  containerWidth: 595.28, 
  containerHeight: 841.89,
  columns: 42, 
  rowHeight: 20, 
  margin: [0, 0],
  padding: [0, 0]
};

const calculateGridPosition = (layout) => {
  const { containerWidth, columns, rowHeight } = gridConfig;
  const gridUnitWidth = containerWidth / columns;
  
  return {
    width: layout.w * gridUnitWidth,
    height: layout.h * rowHeight,
    left: layout.x * gridUnitWidth,
    top: layout.y * rowHeight
  };
};

const validateBlockLayout = (block) => {
  const layout = block.layout || { x: 0, y: 0, w: 12, h: 2 };
  
  return {
    ...layout,
    x: Math.max(0, Math.min(layout.x, gridConfig.columns - layout.w)),
    y: Math.max(0, layout.y),
    w: Math.max(1, Math.min(layout.w, gridConfig.columns)),
    h: Math.max(1, layout.h)
  };
};

const formatPDFData = (data) => {
  return {
    ...data,
    pageBlocks: Object.entries(data.pageBlocks).reduce((acc, [pageNum, blocks]) => {
      acc[pageNum] = blocks.map(block => ({
        ...block,
        layout: validateBlockLayout(block)
      }));
      return acc;
    }, {})
  };
};

const styles = StyleSheet.create({
  page: {
    display: "flex",
    backgroundColor: "#ffffff",
    width: `${gridConfig.containerWidth}pt`,
    height: `${gridConfig.containerHeight}pt`,
    position: "relative",
    overflow: "hidden",
  },
  gridLines: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(to right, #ccc 1px, transparent 1px),
      linear-gradient(to bottom, #ccc 1px, transparent 1px)
    `,
    backgroundSize: `${gridConfig.containerWidth / gridConfig.columns}pt ${gridConfig.rowHeight}pt`,
    zIndex: 0,
    opacity: 0.2
  },
  textBlock: {
    display: "flex",
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: "25px",
    flexDirection: "column",
    position: "absolute",
    border: "1px solid #ccc",
    padding: "10px",
  },
  codeBlock: {
    display: "flex",
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: "25px",
    overflow: "hidden",
    fontFamily: "Courier",
    fontSize: 10,
    position: "absolute",
    border: "1px solid #ccc",
    padding: "10px",
  },
  terminalBlock: {
    display: "flex",
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: "25px",
    fontFamily: "Courier",
    fontSize: 10,
    position: "absolute",
    border: "1px solid #ccc",
    padding: "10px",
  },
  imgBox: {
    backgroundColor: "rgb(255, 255, 255)",
    display: "flex",
    position: "absolute",
    border: "1px solid #ccc",
    padding: "10px",
  },
  emptyPage: {
    display: "flex",
    backgroundColor: "#ffffff",
    width: `${gridConfig.containerWidth}pt`,
    height: `${gridConfig.containerHeight}pt`,
    position: "relative",
    overflow: "hidden",
    backgroundImage: `
      linear-gradient(to right, #ccc 1px, transparent 1px),
      linear-gradient(to bottom, #ccc 1px, transparent 1px)
    `,
    backgroundSize: `${gridConfig.containerWidth / gridConfig.columns}pt ${gridConfig.rowHeight}pt`,
  },
  pageNumber: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 10,
    color: "#666"
  }
});

const PDFGenerator = () => {
  const [pdfData, setPdfData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem("pdfNoteData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setPdfData(formatPDFData(parsedData));
      } else {
        setError("No PDF data found");
      }
    } catch (err) {
      console.error("Error loading PDF data:", err);
      setError("Error loading PDF data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) return <div className="pdf-loading">Loading PDF...</div>;
  if (error) return <div className="pdf-error">Error: {error}</div>;
  if (!pdfData) return <div className="pdf-error">No PDF data found</div>;

  const renderTextContent = (content) => {
    if (!content) return null;

    if (Array.isArray(content)) {
      return content.map((node, i) => {
        if (node.type === "paragraph") {
          return (
            <Text key={i} style={{ marginBottom: 5 }}>
              {node.children.map((child) => child.text).join("")}
            </Text>
          );
        }
        return null;
      });
    }

    return <Text>{String(content)}</Text>;
  };

  const renderBlock = (block) => {
    if (!block) return null;
    
    const layout = validateBlockLayout(block);
    const position = calculateGridPosition(layout);
    
    const blockStyle = {
      ...styles[`${block.type}Block`],
      width: `${position.width}pt`,
      height: `${position.height}pt`,
      left: `${position.left}pt`,
      top: `${position.top}pt`,
      position: "absolute",
      zIndex: layout.z || 1
    };

    switch (block.type) {
      case "text":
        return (
          <View style={blockStyle}>
            {renderTextContent(block.content)}
          </View>
        );
      case "code":
        return (
          <View style={blockStyle}>
            <Text>{String(block.content)}</Text>
          </View>
        );
      case "terminal":
        return (
          <View style={blockStyle}>
            <Text>{String(block.content)}</Text>
          </View>
        );
      case "image":
        return block.content ? (
          <View style={blockStyle}>
            <Image
              source={block.content}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </View>
        ) : null;
      default:
        return null;
    }
  };

  const renderPage = (pageIndex, blocks) => {
    return (
      <Page 
        size="A4" 
        style={styles.page} 
        key={pageIndex}
      >
        <View style={styles.gridLines} />
        <Text style={styles.pageNumber}>
          Page {pageIndex + 1} of {pdfData.totalPages}
        </Text>
        {blocks.length > 0 ? (
          blocks.map((block, i) => (
            <React.Fragment key={block.id || i}>
              {renderBlock(block)}
            </React.Fragment>
          ))
        ) : (
          <View style={styles.emptyPage}>
            <Text style={{ color: "gray" }}>
              Empty Page
            </Text>
          </View>
        )}
      </Page>
    );
  };

  return (
    <div className="pdf-container">
      <PDFViewer>
        <Document>
          {Array.from({ length: pdfData.totalPages }).map((_, pageIndex) => {
            const blocks = pdfData.pageBlocks?.[pageIndex + 1] || [];
            return renderPage(pageIndex, blocks);
          })}
        </Document>
      </PDFViewer>
    </div>
  );
};

export default PDFGenerator;