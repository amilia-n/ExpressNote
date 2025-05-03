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
    width: "595.28pt", // A4 width
    height: "841.89pt", // A4 height
    position: "relative", // For absolute positioning of blocks
    overflow: "hidden"
  },
  textBlock: {
    display: "flex",
    backgroundColor: "rgba(0, 255, 255, 0.398)",
    borderRadius: "25px",
    padding: 10,
    flexDirection: "column",
    position: "absolute",
  },
  codeBlock: {
    display: "flex",
    backgroundColor: "#ffffff",
    borderRadius: "25px",
    overflow: "hidden",
    fontFamily: "Courier",
    fontSize: 10,
    padding: 10,
    position: "absolute",
  },
  terminalBlock: {
    display: "flex",
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: "25px",
    fontFamily: "Courier",
    fontSize: 10,
    padding: 10,
    position: "absolute",
  },
  imgBox: {
    backgroundColor: "rgba(255, 200, 200, 0.398)",
    display: "flex",
    padding: 10,
    position: "absolute",
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
    
    // A4 dimensions in points
    const pageWidth = 595.28; // A4 width in points
    const pageHeight = 841.89; // A4 height in points
    
    // Convert NoteContainer's pixel-based measurements to points
    // 1 point = 1/72 inch, 1 pixel = 1/96 inch (assuming 96 DPI)
    const pixelToPoint = 72/96;
    const rowHeight = 100 * pixelToPoint; // Convert 100px to points
    const margin = 10 * pixelToPoint; // Convert 10px to points

    // Calculate available space after margins
    const availableWidth = pageWidth - (margin * 2);
    const availableHeight = pageHeight - (margin * 2);

    // Calculate block dimensions based on grid units
    const blockWidth = (layout.w / 12) * availableWidth;
    const blockHeight = Math.min(layout.h * rowHeight, availableHeight - top);
    const left = (layout.x / 12) * availableWidth + margin;
    const top = layout.y * rowHeight + margin;

    const blockStyle = {
        width: `${blockWidth}pt`,
        height: `${blockHeight}pt`,
        left: `${left}pt`,
        top: `${top}pt`,
        position: 'absolute',
        ...styles[`${block.type}Block`]
    };

    switch (block.type) {
        case 'text':
            return (
                <View style={blockStyle}>
                    {renderTextContent(block.content)}
                </View>
            );
        case 'code':
            return (
                <View style={blockStyle}>
                    <Text>{String(block.content)}</Text>
                </View>
            );
        case 'terminal':
            return (
                <View style={blockStyle}>
                    <Text>{String(block.content)}</Text>
                </View>
            );
        case 'image':
            return block.content ? (
                <View style={blockStyle}>
                    <Image source={block.content} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </View>
            ) : null;
        default:
            return null;
    }
};

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
