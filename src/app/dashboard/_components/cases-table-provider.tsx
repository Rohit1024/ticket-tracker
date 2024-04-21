"use client";

import * as React from "react";

import { ToggleButton } from "@/components/toggle-button";
import { Cog, SquareIcon } from "lucide-react";

interface CasesTableContextProps {
  enableAdvancedFilter: boolean;
  setEnableAdvancedFilter: React.Dispatch<React.SetStateAction<boolean>>;
  showFloatingBar: boolean;
  setShowFloatingBar: React.Dispatch<React.SetStateAction<boolean>>;
}

const CasesTableContext = React.createContext<CasesTableContextProps>({
  enableAdvancedFilter: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setEnableAdvancedFilter: () => {},
  showFloatingBar: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setShowFloatingBar: () => {},
});

export function useCasesTable() {
  const context = React.useContext(CasesTableContext);
  if (!context) {
    throw new Error("useTasksTable must be used within a TasksTableProvider");
  }
  return context;
}

export function CasesTableProvider({ children }: React.PropsWithChildren) {
  const [enableAdvancedFilter, setEnableAdvancedFilter] = React.useState(false);
  const [showFloatingBar, setShowFloatingBar] = React.useState(false);

  return (
    <CasesTableContext.Provider
      value={{
        enableAdvancedFilter,
        setEnableAdvancedFilter,
        showFloatingBar,
        setShowFloatingBar,
      }}
    >
      <div className="flex w-full items-center space-x-2 overflow-x-auto">
        {/* <ToggleButton
          onClick={() => setEnableAdvancedFilter(!enableAdvancedFilter)}
          tooltipTitle="Toggle advanced filter"
          tooltipDescription="A notion like query builder to filter rows."
        >
          <Cog className="mr-2 size-4 shrink-0" aria-hidden="true" />
          Advanced filter
        </ToggleButton>
        <ToggleButton
          onClick={() => setShowFloatingBar(!showFloatingBar)}
          tooltipTitle="Toggle floating bar"
          tooltipDescription="A floating bar to perform actions on selected rows."
        >
          <SquareIcon className="mr-2 size-4 shrink-0" aria-hidden="true" />
          Floating bar
        </ToggleButton> */}
      </div>
      {children}
    </CasesTableContext.Provider>
  );
}
