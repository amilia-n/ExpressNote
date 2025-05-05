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

const styles = StyleSheet.create({
  page: {
    display: "flex",
    backgroundColor: "#ffffff",
    width: "595.28pt", 
    height: "841.89pt",
    position: "relative",
    overflow: "hidden",
  },
  gridLines: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)",
    backgroundSize: "14.17pt 14.17pt",
    zIndex: 0,
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
    width: "595.28pt",
    height: "841.89pt",
    position: "relative",
    overflow: "hidden",
    backgroundImage:
      "linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)",
    backgroundSize: "14.17pt 14.17pt",
  },
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
        setPdfData(parsedData);
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
  
    const layout = block.layout || { x: 0, y: 0, w: 12, h: 2 };
    
    // Match NoteContainer's grid system
    const containerWidth = 595.28; // A4 width minus padding
    
    // Calculate grid units based on NoteContainer's system
    const gridUnitWidth = containerWidth / 42; // 42 columns
    const gridUnitHeight = 20; // Same as NoteContainer's rowHeight
    
    // Convert grid positions to points
    const blockWidth = layout.w * gridUnitWidth;
    const blockHeight = layout.h * gridUnitHeight;
    const left = layout.x * gridUnitWidth;
    const top = layout.y * gridUnitHeight;
  
    const blockStyle = {
      width: `${blockWidth}pt`,
      height: `${blockHeight}pt`,
      left: `${left}pt`,
      top: `${top}pt`,
      position: "absolute",
      ...styles[`${block.type}Block`],
    };
  
    switch (block.type) {
      case "text":
        return <View style={blockStyle}>{renderTextContent(block.content)}</View>;
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

  // const renderPage = (pageNumber) => {
  //   const pageBlocks = pdfData.pageBlocks[pageNumber] || [];
  //   const hasContent = pageBlocks.length > 0;

  //   return (
  //     <Page key={pageNumber} size="A4" style={hasContent ? styles.page : styles.emptyPage}>
  //       <View style={styles.gridLines} />
  //       {hasContent ? (
  //         pageBlocks.map((block) => (
  //           <View key={block.id || block.blockId}>
  //             {renderBlock(block)}
  //           </View>
  //         ))
  //       ) : (
  //         <View>
  //           <Text style={{ textAlign: "center", marginTop: "50%" }}>
  //             Page {pageNumber}
  //           </Text>
  //         </View>
  //       )}
  //     </Page>
  //   );
  // };

  return (
    <div className="pdf-container">
        <PDFViewer style={{ width: "100%", height: "100vh" }}>
            <Document>
                <Page size="A4" style={styles.page}>
                    {pdfData.pageBlocks[pdfData.currentPage]
                        ?.sort((a, b) => {
                            // First sort by y position
                            if (a.layout.y !== b.layout.y) {
                                return a.layout.y - b.layout.y;
                            }
                            // If y is the same, sort by x position
                            return a.layout.x - b.layout.x;
                        })
                        .map((block, index) => (
                            <View key={block.id || index}>
                                {renderBlock(block)}
                            </View>
                        ))}
                </Page>
            </Document>
        </PDFViewer>
    </div>
  );
};

export default PDFGenerator;

