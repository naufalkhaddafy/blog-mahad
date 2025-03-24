import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BannerProps } from '@/pages/Banner/Index';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Link, router } from '@inertiajs/react';
import { GripHorizontal, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { ModalDeleteBanner } from './ModalBanner';

export default function ReorderList({
    items,
    selectedEditBanner,
}: {
    items: BannerProps[];
    selectedEditBanner: (value: BannerProps) => void;
}) {
    const [data, setData] = useState(items);

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        // Reorder list
        const newData = [...data];
        const [movedItem] = newData.splice(result.source.index, 1);
        newData.splice(result.destination.index, 0, movedItem);

        // Update order index
        const reorderedData = newData.map((item, index) => ({
            ...item,
            order: index + 1,
        }));

        setData(reorderedData);

        // Kirim data ke backend
        router.post('/banner/reorder', { items: reorderedData, type: 'order' });
    };

    const handleChangeActive = (id: number, checked: boolean | number) => {
        router.post('/banner/reorder', { id: id, type: 'active', status: checked });
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="list">
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="col-1 grid w-full max-w-screen gap-3 border-1 p-4"
                    >
                        {data.map((item, index) => (
                            <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                                {(provided) => (
                                    <Card
                                        key={index}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className="custom-scrollbar w-full max-w-screen overflow-x-scroll p-2 md:p-4"
                                    >
                                        <div className="flex items-center gap-1 md:gap-8">
                                            <div className="flex cursor-grab items-center gap-2 p-2">
                                                <div {...provided.dragHandleProps}>
                                                    <GripHorizontal />
                                                </div>
                                            </div>
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                loading="lazy"
                                                className="aspect-video w-44 rounded-lg"
                                            />
                                            <div className="px-2 md:hidden">
                                                <Switch
                                                    id="status-active"
                                                    defaultChecked={
                                                        item.status === 1 ? true : false
                                                    }
                                                    onCheckedChange={(checked) =>
                                                        handleChangeActive(
                                                            item.id,
                                                            checked ? true : false,
                                                        )
                                                    }
                                                />
                                                <Label htmlFor="status-active">Active</Label>
                                            </div>
                                            <div className="px-5">{index + 1}</div>
                                            <div className="w-full min-w-56 px-5">
                                                <h3 className="text-md py-3 font-bold">
                                                    {item.title}
                                                </h3>
                                                <Link href={item.url || ''}>
                                                    <p className="text-sm text-blue-600 underline">
                                                        {item.url}
                                                    </p>
                                                </Link>
                                            </div>
                                            <div className="hidden -translate-x-5 items-center gap-2 md:flex">
                                                <Switch
                                                    id="status-active"
                                                    defaultChecked={
                                                        item.status === 1 ? true : false
                                                    }
                                                    onCheckedChange={(checked) =>
                                                        handleChangeActive(
                                                            item.id,
                                                            checked ? true : false,
                                                        )
                                                    }
                                                />
                                                <Label htmlFor="status-active">Active</Label>
                                            </div>
                                            <div className="p-5">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <MoreHorizontal />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>
                                                            Actions
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem asChild>
                                                            <button
                                                                className="w-full"
                                                                onClick={() =>
                                                                    selectedEditBanner(item)
                                                                }
                                                            >
                                                                Edit
                                                            </button>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <ModalDeleteBanner banner={item} />
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
