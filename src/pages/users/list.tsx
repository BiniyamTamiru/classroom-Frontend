import { useState } from "react";
import { Search } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb.tsx";
import { ListView } from "@/components/refine-ui/views/list-view.tsx";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";

const UserList = () => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <ListView>
            <Breadcrumb />

            <h1 className="page-title">Users</h1>

            <div className="action-row flex flex-col gap-4">
                <div className="relative w-2/5 py-3">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                    <input
                        type="text"
                        placeholder="Search users by name..."
                        className="w-1/2 pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <CreateButton />
                </div>
            </div>
        </ListView>
    );
};

export default UserList;