// chart.tsx
import {
  BlockNoteEditor,
  BlockSchemaWithBlock,
  defaultProps,
  defaultBlockSpecs,
} from "@blocknote/core";
import {
  BlockNoteView,
  useBlockNote,
  ReactSlashMenuItem,
  createReactBlockSpec,
} from "@blocknote/react";
import { useTheme } from "next-themes";
import { PieChart } from "lucide-react";
import React, { useState, useEffect } from "react";

// 새로운 함수: 초기 테이블 데이터를 반환하는 함수
const getDefaultTableData = (): string[][] => [
  ["First Name", "Second Name", "Third Name"],
  ["", "", ""],
];
const initialTableData = getDefaultTableData();

// 차트 블록 스펙 추가
export const chartBlock = createReactBlockSpec(
  {
    type: "chart",
    propSchema: {
      ...defaultProps,
      name: {
        default: "chart block",
      },
      tableData: {
        default: JSON.stringify(initialTableData),
      },
    } as const,
    content: "none",
  },
  {
    render: ({ block, editor }) => (
      <RenderChartBlock
        name={block.props.name}
        onChange={(name) => {
          editor.updateBlock(block, {
            type: "chart",
            props: { name: name, tableData: block.props.tableData },
          });
        }}
        tableData={JSON.parse(block.props.tableData)}
      />
    ),
  }
);

const RenderChartBlock = ({
  name,
  onChange,
  tableData: initialTableData,
}: {
  name: string;
  onChange: (name: string) => void;
  tableData: string[][];
}) => {
  const [firstName, setFirstName] = useState("First Name");
  const [secondName, setSecondName] = useState("Second Name");
  const [thirdName, setThirdName] = useState("Third Name");
  const [tableData, setTableData] = useState<string[][]>(initialTableData);

  useEffect(() => {
    // 로컬 스토리지에서 데이터 불러오기
    const storedTableData = localStorage.getItem("tableData");
    let initialTableData: string[][];
    if (storedTableData) {
      initialTableData = JSON.parse(storedTableData);
    } else {
      // 새로운 테이블을 생성할 때는 기본 테이블 데이터를 가져오기만 함
      initialTableData = getDefaultTableData();
      // localStorage.setItem("tableData", JSON.stringify(initialTableData)); //이건 initialTableData를 JSON 형식으로 변환한 후 로컬 스토리지에 저장
    }
    setTableData(initialTableData);
  }, []);

  //여기 아래 주석은 상관없는 (혹시 몰라 나둠)
  // const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const updatedFirstName = e.target.value;
  //   setFirstName(updatedFirstName);
  //   localStorage.setItem("firstName", updatedFirstName);
  //   onChange(updatedFirstName);
  // };

  // const handleSecondNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const updatedSecondName = e.target.value;
  //   setSecondName(updatedSecondName);
  //   localStorage.setItem("secondName", updatedSecondName);
  // };

  // const handleThirdNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const updatedThirdName = e.target.value;
  //   setThirdName(updatedThirdName);
  //   localStorage.setItem("thirdName", updatedThirdName);
  // };

  const addRow = () => {
    // 새로운 row 추가 로직
    const newRow = ["", "", ""];
    setTableData((prevTableData) => [...prevTableData, newRow]);
    localStorage.setItem("tableData", JSON.stringify([...tableData, newRow]));
  };

  const addColumn = () => {
    // 새로운 column 추가 로직
    setTableData((prevTableData) => prevTableData.map((row) => [...row, ""]));
    localStorage.setItem(
      "tableData",
      JSON.stringify([...tableData.map((row) => [...row, ""])])
    );
  };

  const deleteRow = (index: number) => {
    // 특정 row 삭제 로직
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);
    localStorage.setItem("tableData", JSON.stringify(updatedTableData));
  };

  const deleteColumn = (index: number) => {
    // 특정 column 삭제 로직
    const updatedTableData = [...tableData];
    updatedTableData.forEach((row) => row.splice(index, 1));
    setTableData(updatedTableData);
    localStorage.setItem("tableData", JSON.stringify(updatedTableData));
  };

  const deleteButtons = (
    <>
      <button
        onClick={() => deleteRow(tableData.length - 1)}
        style={{
          borderRadius: "10px",
          backgroundColor: "red",
          color: "white",
          padding: "5px",
          margin: "5px",
        }}
      >
        Delete Last Row
      </button>
      <button
        onClick={() => deleteColumn(tableData[0].length - 1)}
        style={{
          borderRadius: "10px",
          backgroundColor: "red",
          color: "white",
          padding: "5px",
          margin: "5px",
        }}
      >
        Delete Last Column
      </button>
    </>
  );

  return (
    <div>
      <h1 style={{ fontWeight: "bold" }}>Pie Chart Table</h1>{" "}
      <table id="chartTable">
        {tableData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>
                <input
                  value={cell}
                  onChange={(e) => {
                    const updatedTableData = [...tableData];
                    updatedTableData[rowIndex][cellIndex] = e.target.value;
                    setTableData(updatedTableData);
                    localStorage.setItem(
                      "tableData",
                      JSON.stringify(updatedTableData)
                    );
                  }}
                />
              </td>
            ))}
          </tr>
        ))}
      </table>
      <button
        onClick={addRow}
        style={{
          borderRadius: "10px",
          backgroundColor: "black",
          color: "white",
          padding: "5px",
          margin: "5px",
        }}
      >
        Add Row
      </button>
      <button
        onClick={addColumn}
        style={{
          borderRadius: "10px",
          backgroundColor: "black",
          color: "white",
          padding: "5px",
          margin: "5px",
        }}
      >
        Add Column
      </button>
      {deleteButtons}
    </div>
  );
};

// 차트 블록 메뉴 아이템 추가
export const insertChartBlock: ReactSlashMenuItem<
  BlockSchemaWithBlock<"chart", typeof chartBlock.config>
> = {
  name: "Insert Chart Block",
  execute: (editor) => {
    // const initialTableData: string[][] = [
    //   ["First Name", "Second Name", "Third Name"],
    //   ["", "", ""],
    // ]; //추추가

    const defaultTableData: string[][] = getDefaultTableData(); // 기본 테이블 데이터를 가져옴

    editor.insertBlocks(
      [
        {
          type: "chart",
          props: {
            tableData: JSON.stringify(defaultTableData),
          },
        },
      ],
      editor.getTextCursorPosition().block,
      "after"
    );
  },
  group: "Media",
  icon: <PieChart width="14" height="14" />,
  hint: "Insert a chart block!",
};

export default RenderChartBlock;
